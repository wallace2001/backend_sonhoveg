import { Request, Response } from "express";
import MercadoPago from 'mercadopago';
import { v4 as uuid } from "uuid";

MercadoPago.configure({
    sandbox: true,
    access_token: process.env.ACCESS_TOKEN_MERCADO_PAGO,
});

interface PropsRequest extends Request{
    userId: string;
}

class PaymentsController{
    async index(req: PropsRequest, res: Response){
        const id = uuid();
        const { email } = req.query;

        const date = {
            items: [
                {
                    id,
                    description: "5x milkshakes;3x bolos",
                    quantity: 1,
                    currency: 'BRL',
                    unit_price: Number(49),
                }
            ],
            payer: {
                email: String(email),
            },
            external_reference: id
        }

        try {
            const payment = await MercadoPago.preferences.create(date);
            return res.redirect(payment.body.init_point);
        } catch (error) {
            res.send({ error });
        }
        
    }

    async show(req: PropsRequest, res: Response){
        console.log(req.query);
        return res.send('OK');
    }
}

export { PaymentsController };