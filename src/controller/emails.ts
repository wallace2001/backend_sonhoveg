import { Request, Response } from 'express';
import { connection as knex } from '../database/connection';
import { MailerCreate } from '../mail/mailerCreate';

interface PropsRequest extends Request{
    userId: string;
}

class SendEmails{
    async create(req: PropsRequest, res: Response){
        const id = req.userId;
        const { toEmail, hmtl, title } = req.body;
        const mailerCreate = new MailerCreate();

        try {
            const user = await knex("users").where("id", id).first();

            if(!user){
                return res.send({ error: "Usuário não existe." });
            }

            if(!user.admin){
                return res.send({ error: "Usuário não identificado como administrador." });
            }

            const message = {
                from: process.env.USERNAME_HOST,
                to: toEmail,
                subject: `${title}`,
                // text: "Clique no botão abaixo",
                html: `${hmtl}`
            }
    
            await mailerCreate.send({
                message
            });
        } catch (error) {
            res.send({ error });
        }
    }
}

export { SendEmails }