import { Request, Response } from "express";
import paypal from 'paypal-rest-sdk';
import { connection as knex } from '../database/connection';
import { v4 as uuid } from "uuid";

const paypalConfig = require('../config/paypal.json');

paypal.configure(paypalConfig);


interface PropsRequest extends Request{
    userId: string;
}

interface PropsProducts{
    id: string;
    title: string;
    price: string;
    description: string;
    calories: string;
}

class PaymentsController{
    async index(req: PropsRequest, res: Response){
    }

    async buy(req: PropsRequest, res: Response){
        const { 
            productId,
         } = req.query;

         console.log(productId);

        try {
            // const trx = await knex.transaction();

            const product: PropsProducts = await knex("products").where("id", String(productId)).first();
            console.log(product);
            // const user = await trx("users").where("id", req.userId).first();

            // if(!user){
            //     return res.send({ error: "Usuário não existe." });
            // }

            const cart = [{
                name: product.title,
                sku: product.id,
                price: product.price,
                currency: "BRL",
                quantity: 1
            }];

            const value = { currency: "BRL", total: 40};
            const description = product.description;

            const create_payment_json: any = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "http://localhost:3002/auth/payment/success",
                    "cancel_url": "http://localhost:3002/auth/payment/cancel"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": "item",
                            "sku": "item",
                            "price": "1.00",
                            "currency": "BRL",
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": "BRL",
                        "total": "1.00"
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

            // await trx.commit;
        } catch (error) {
            res.send({ error });
        }
    }

    async success(req: PropsRequest, res: Response){
        const { PayerID, paymentId } = req.query;
        const value = {
            "currency": "BRL",
            "total": "40.00",
        }

        const execute_payment_json: any = {
            "payer_id": PayerID,
            "transactions": [{
                "amount": {
                    "currency": "BRL",
                    "total": "1.00"
                }
            }]
        };

        paypal.payment.execute(String(paymentId), execute_payment_json, async (err, payment: any) => {
            if(err){
                return res.send({ err });
            }else{
                const payments = {
                    "id": payment.id,
                    "user_id": 1,
                    "intent": payment.intent,
                    "state": payment.state,
                    "cart": payment.cart,
                    "payer": {
                        "payment_method": payment.payer.payment_method,
                        "status": payment.payer.status,
                        "payer_info": {
                          "email": payment.payer.payer_info,
                          "first_name": payment.payer.payer_info.first_name,
                          "last_name": payment.payer.payer_info.last_name,
                          "payer_id": payment.payer.payer_info.payer_id,
                          "shipping_address": {
                            "recipient_name": payment.payer.payer_info.shipping_address.recipient_name,
                            "line1": payment.payer.payer_info.shipping_address.line1,
                            "city": payment.payer.payer_info.shipping_address.city,
                            "state": payment.payer.payer_info.shipping_address.state,
                            "postal_code": payment.payer.payer_info.shipping_address.postal_code,
                            "country_code": payment.payer.payer_info.shipping_address.country_code,
                            "normalization_status": payment.payer.payer_info.shipping_address.normalization_status
                          },
                          "tax_id_type": payment.payer.tax_id_type,
                          "tax_id": payment.payer.tax_id,
                          "country_code": payment.payer.country_code
                        }
                      },
                    "transactions": [{
                        "amount": {
                            "total": payment.transactions[0].amount.total,
                            "currency": payment.transactions[0].amount.currency,
                            "details": {
                              "subtotal": payment.transactions[0].amount.details.subtotal,
                              "shipping": payment.transactions[0].amount.details.shipping,
                              "insurance": payment.transactions[0].amount.details.insurance,
                              "handling_fee": payment.transactions[0].amount.details.handling_fee,
                              "shipping_discount": payment.transactions[0].amount.details.shipping_discount,
                              "discount": payment.transactions[0].amount.details.discount
                            }
                        }
                    }],
                    "create_time": payment.create_time,
                    "update_time": payment.update_time,
                }

                // const save = {
                //     "id": payments.id,
                //     "user_id": 1,
                //     "intent": payments.intent,
                //     "state": payments.state,
                //     "cart": payments.cart,
                //     "payer": JSON.stringify(payments.payer),
                //     "transactions": JSON.stringify(payments.transactions),
                //     "create_time": payments.create_time,
                //     "update_time": payments.update_time,
                // }
                // await knex("payments").insert(save);
                const ts = await knex("payments").where("id", String("PAYID-MC3JV3Y3H624800CL033782T")).first();
                const fs = {
                    "id": ts.id,
                    "user_id": 1,
                    "intent": ts.intent,
                    "state": ts.state,
                    "cart": ts.cart,
                    "payer": JSON.parse(ts.payer),
                    "transactions": JSON.parse(ts.transactions),
                    "create_time": ts.create_time,
                    "update_time": ts.update_time,
                }

                return res.send({ fs });
                //console.log(payment);
            }
        })
    }

    async cancel(req: PropsRequest, res: Response){
        res.json({message: "Ok"});
    }
}

export { PaymentsController };