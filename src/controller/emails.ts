import { Request, Response } from 'express';
import { connection as knex } from '../database/connection';
import { MailerCreate } from '../mail/mailerCreate';
import { v4 as uuid } from 'uuid'

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

    async sendEmail(req: PropsRequest, res: Response){
        const {
            mailerReceive,
            title,
            description
        } = req.body;

        const id = req.userId;
        console.log(
            mailerReceive,
            title,
            description);

        try {
            const mailerCreate = new MailerCreate();
            const user = await knex("users").where("id", id).first();
            const users = await knex("users");
            const usersEmail = [];

            const mailer = await knex("users").where("id", id).first();

            if(!mailerReceive){
                users.map(item => usersEmail.push(item.email));
            }

            if(!user){
                return res.send({error: "Usuário inexistente"});
            }

            const email = {
                id: uuid(),
                email: mailer,
                mailerSend: user.email,
                title,
                description
            }

            const message = {
                from: process.env.USERNAME_HOST,
                to: !mailer ? [...usersEmail] : mailer,
                subject: `${title}`,
                // text: "Clique no botão abaixo",
                html: `${description}`
            }

            await mailerCreate.send({
                message
            });

            return res.send(message);
        } catch (error) {
            return res.send({ error });
        }
    }
}

export { SendEmails }