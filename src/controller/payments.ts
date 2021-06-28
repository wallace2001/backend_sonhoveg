import { Request, Response } from "express";
import paypal from 'paypal-rest-sdk';
import { connection as knex } from '../database/connection';
import { v4 as uuid } from "uuid";
import { io } from '../http';
import { Socket } from 'socket.io';

const paypalConfig = require('../config/paypal.json');

paypal.configure(paypalConfig);


interface PropsRequest extends Request{
    userId: string;
}

class PaymentsController{

    async index(req: PropsRequest, res: Response){
    }

    async saveCart(req: PropsRequest, res: Response){
        const { 
            products,
            date
         } = req.body;

         console.log(req.userId);

         const id = req.userId;

         try {
            const user = await knex("users").where("id", id).first();
            const cartAll = await knex("cart_payments");

            if(cartAll.length !== 0){
                products.filter(async(item, i) => {
                    const tes = cartAll[i];
                    if(tes){
                        if(item.name === cartAll[i].name){
                            console.log('Update2');
                            await knex("cart_payments").where("user_id", id).where("sku", products[i].id).where("name", products[i].name).update({
                                name: products[i].name,
                                sku: products[i].id,
                                price: String(Number(products[i].price)),
                                date: date,
                                currency: "BRL",
                                quantity: String(products[i].quantity)
                            });
                        }
                    }
                    if(tes === undefined){
                        console.log('Create');
                        await knex("cart_payments").insert({
                        id: uuid(),
                        user_id: user.id,
                        name: products[i].name,
                        sku: products[i].id,
                        price: String(Number(products[i].price)),
                        date: date,
                        currency: "BRL",
                        quantity: String(products[i].quantity)
                    });
                    }
                })
            }else{
                console.log("Create_First");
                products.forEach(async(product) => {
                    await knex("cart_payments").insert({
                        id: uuid(),
                        user_id: user.id,
                        name: product.name,
                        sku: product.id,
                        price: String(Number(product.price)),
                        date: date,
                        currency: "BRL",
                        quantity: String(product.quantity)
                    });
                });
            }

            return res.send({message: "Carrinho salvado."});
            
         } catch (error) {
             return res.send({error});
         }
    }

    async deleteCart(req: PropsRequest, res: Response){
        const {
            id
        } = req.query;

        console.log(id);

        try {
            await knex("cart_payments").where("sku", String(id)).delete();
            return res.send({message: "Apagado com sucesso."});
        } catch (error) {
            return res.send({error});
        }
    }

    async buy(req: PropsRequest, res: Response){
        const { id } = req.query;
        console.log(id);

        try {
            const user = await knex("users").where("id", String(id)).first();
            
            if(!user){
                return res.send({error: "Usuário não encontrado."});
            }

            const items = await knex("cart_payments")
            .where("user_id", String(id))
            .select([
                "cart_payments.name",
                "cart_payments.sku",
                "cart_payments.price",
                "cart_payments.date",
                "cart_payments.currency",
                "cart_payments.quantity",
            ]);

            let priceFinal = 0;
            items.forEach(item => {
                priceFinal = Number(Number(priceFinal) + Number(item.price));
            });
            const price = priceFinal.toFixed(2);

            const create_payment_json: any = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": `${process.env.API_URL_PRODUCTION}auth/payment/success?id=${id}`,
                    "cancel_url": `${process.env.API_URL_PRODUCTION}auth/payment/cancel`
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": "item",
                            "sku": "item",
                            "price": parseFloat(price),
                            "currency": "BRL",
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": "BRL",
                        "total": parseFloat(price)
                    },
                    "description": "This is the payment description."
                }]
            };

            await paypal.payment.create(create_payment_json, (err, payment) => {
                if(err){
                    console.log(err);
                }else{
                    payment.links.forEach((link) => {
                        if(link.rel === 'approval_url') return res.redirect(link.href);
                    })
                }
            })
        } catch (error) {
            res.send({ error });
        }
    }

    async success(req: PropsRequest, res: Response){
        const { PayerID, paymentId, id } = req.query;
        try {

            const items = await knex("cart_payments")
            .where("user_id", String(id))
            .select([
                "cart_payments.name",
                "cart_payments.sku",
                "cart_payments.price",
                "cart_payments.date",
                "cart_payments.currency",
                "cart_payments.quantity",
            ]);

            const user = await knex("users").where("id", String(id)).first();

            let priceFinal = 0;
            items.forEach(item => {
                priceFinal = Number(Number(priceFinal) + Number(item.price));
            });
            const price = priceFinal.toFixed(2);


            const execute_payment_json: any = {
                "payer_id": PayerID,
                "transactions": [{
                    "amount": {
                        "currency": "BRL",
                        "total": parseFloat(price)
                    }
                }]
            };
    
            paypal.payment.execute(String(paymentId), execute_payment_json, async (err, payment: any) => {
                if(err){
                    return res.send({ err });
                }else{
                    const itemsName = items.filter(item => ({name: item.name}));
                    const payments = await {
                        "id": payment?.id,
                        "user_id": String(id),
                        "intent": payment?.intent,
                        "state": payment?.state,
                        "cart": payment?.cart,
                        "payer": {
                            "payment_method": payment?.payer.payment_method,
                            "status": payment?.payer.status,
                            "payer_info": {
                              "email": payment?.payer.payer_info,
                              "first_name": payment?.payer.payer_info.first_name,
                              "last_name": payment?.payer.payer_info.last_name,
                              "payer_id": payment?.payer.payer_info.payer_id,
                              "shipping_address": {
                                "recipient_name": payment?.payer.payer_info.shipping_address.recipient_name,
                                "line1": payment?.payer.payer_info.shipping_address.line1,
                                "city": payment?.payer.payer_info.shipping_address.city,
                                "state": payment?.payer.payer_info.shipping_address.state,
                                "postal_code": payment?.payer.payer_info.shipping_address.postal_code,
                                "country_code": payment?.payer.payer_info.shipping_address.country_code,
                                "normalization_status": payment?.payer.payer_info.shipping_address.normalization_status
                              },
                              "tax_id_type": payment?.payer.tax_id_type,
                              "tax_id": payment?.payer.tax_id,
                              "country_code": payment?.payer.country_code
                            }
                          },
                        "transactions": [{
                            "amount": {
                                "total": payment?.transactions[0].amount.total,
                                "currency": payment?.transactions[0].amount.currency,
                                "details": {
                                  "subtotal": payment?.transactions[0].amount.details.subtotal,
                                  "shipping": payment?.transactions[0].amount.details.shipping,
                                  "insurance": payment?.transactions[0].amount.details.insurance,
                                  "handling_fee": payment?.transactions[0].amount.details.handling_fee,
                                  "shipping_discount": payment?.transactions[0].amount.details.shipping_discount,
                                  "discount": payment?.transactions[0].amount.details.discount
                                }
                            }
                        }],
                        "date": items[0].date,
                        "create_time": payment?.create_time,
                        "update_time": payment?.update_time,
                    }
    
                    const save = {
                        "id": payments.id,
                        "user_id": payments.user_id,
                        "intent": payments.intent,
                        "state": payments.state,
                        "cart": payments.cart,
                        "status": "pendente",
                        "date": payments.date,
                        "payer": JSON.stringify(payments.payer),
                        "transactions": JSON.stringify(payments.transactions),
                        "telphone": user.telphone,
                        "products": JSON.stringify(itemsName),
                        "create_time": payments.create_time,
                        "update_time": payments.update_time,
                    }
                    if(!await knex("payments").where("id", payment?.id).first()){
                        await knex("payments").insert(save);
                    }
                    const ts = await knex("payments").where("id", payment?.id).first();
                    const fs = {
                        "id": ts.id,
                        "user_id": ts.user_id,
                        "intent": ts.intent,
                        "state": ts.state,
                        "status": ts.status,
                        "date": ts.date,
                        "products": ts.products,
                        "cart": ts.cart,
                        "telphone": user.telphone,
                        "payer": JSON.parse(ts.payer),
                        "transactions": JSON.parse(ts.transactions),
                        "create_time": ts.create_time,
                        "update_time": ts.update_time,
                    }
                    
                    io.emit('newRequest', fs);
                    return res.redirect(`${process.env.API_URL_DOMAIN}payment_success/${fs.id}`);
                }
            });
        } catch (error) {
            return res.send({error});
        }
    }

    async cancel(req: PropsRequest, res: Response){
        res.redirect(`${process.env.API_URL_DOMAIN}`);
        res.json({message: "Ok"});
    }

    async payments(req: PropsRequest, res: Response){
        try {
            const request = await knex("payments");

            return res.send(request);
        } catch (error) {
            return res.send({error});
        }
    }

    async userPayment(req: PropsRequest, res: Response){
        const id = req.userId;
        try {
            const userPayments = await knex("payments").where("user_id", String(id));
            return res.send(userPayments);
        } catch (error) {
            return res.send({ error });
        }
    }

    async updateStatus(req: PropsRequest, res: Response){
        const {
            status
        } = req.body;
        console.log(status);
        const { idPayment } = req.params;
        console.log(idPayment);
        try {

            await knex("payments").where("id", idPayment).first().update({
                "status": status
            });

            const productUpdated = await knex("payments").where("id", idPayment).first();

            io.emit("updateStatusProduct", productUpdated);
            return res.send({message: "Atualizado com sucesso."});
        } catch (error) {
            return res.send({error});
        }
    }
}

export { PaymentsController };