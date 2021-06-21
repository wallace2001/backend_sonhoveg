import { Request, Response } from 'express';
import { connection as knex } from '../database/connection';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodeMailer from 'nodemailer';
import { MailerCreate } from '../mail/mailerCreate';

const generateToken = (params = {}) => {
    return jwt.sign(params, process.env.SECRET_TOKEN, {
        expiresIn: 86400
    })
}

interface ReqProps extends Request{
    userId: string;
}

class CreateUser{
    async create(req: Request, res: Response){
        const {
            name,
            email,
            password,
            date,
            telphone,
            sex,
            admin
        } = req.body;

        const mailerCreate = new MailerCreate();

        try {

            const passwordEncripted = await bcrypt.hash(password, 10);
            // const trx = await knex.transaction();

            const emailAlreadyExists = await knex("users").where({
                email: String(email).toLowerCase()
            }).select('email').first();

            if(emailAlreadyExists)
                 return res.json({error: "E-mail já cadastrado."});

            const data = {
                name,
                email: String(email).toLowerCase(),
                telphone,
                year: date,
                sex: sex === '1' ? 'Masculino' : sex === '2' ? 'Feminino' : 'NoN',
                password: passwordEncripted,
                admin: false
            }


            const createUser = await knex("users").insert(data);
            const idUserNow = await knex("users").where({
                email
            }).select("id").first();

            
            const token = generateToken({ 
                id: idUserNow
             })

             const message = {
                from: process.env.USERNAME_HOST,
                to: email,
                subject: "Olá, Confirme seu e-mail para finalizar seu cadastro.",
                text: "Clique no botão abaixo",
                html: `
                    <h2>Olá ${name}, Para continuar no site é preciso que você confirme sua conta.</h2>
                    <a href=${process.env.API_URL_PRODUCTION}/confirmaccout/id=${idUserNow.id}&token=${token}>Confirmar conta</a>
                `
            }

             await mailerCreate.send({
                 message
             });

            return res.json({createUser, token, status: true});
        } catch (error) {
            res.send({error});
        }
    }

    async index(req: Request, res: Response){
        const {
            email,
            password
        } = req.body;


        try {
            const account = await knex("users").where({
                email
            }).first();
            if(!account?.email){
                res.json({error: "Conta não existe!"});
            }

            if(!account?.confirmAccount){
                return res.json({error: "Conta não confirmada"});
            }


            if(!await bcrypt.compare(password, account?.password)){
                return res.json({error: "Senha inválida"});
            }

            res.json({
                account,
                token: generateToken({id: account.id})
            })
        } catch (error) {
            console.log({error});
        }
    }

    async showConfirm(req: Request, res: Response){
        const {
            id,
            token
        } = req.params

        // console.log(id.substring(1), token.substring(1));

        try {

            const user = await knex("users").where("id", id.substring(1)).first();

            if(user.confirmAccount){
                return res.redirect('http://localhost:3000/confirmaccout/1')
            }
            
            const userConfirmed = await knex("users").where("id", id.substring(1)).update({
                confirmAccount: true
            });

            return res.redirect('http://localhost:3000/confirmaccout/0');
        } catch (error) {
            console.log({ error });
        }
    }

    async user (req: ReqProps, res: Response){
        
        try {
            const user = await knex("users").where("id", req.userId).first();

            res.json({
                ok : true,
                id: user.id,
                name: user.name, 
                email: user.email,
                admin: user.admin,
                sex: user.sex,
                telphone: user.telphone
            });
            
        } catch (error) {
            return res.send({error});   
        }
    }

    async listUser(req: ReqProps, res: Response){
        const user = await knex("users");
        try {
            return res.send(user);
        } catch (error) {
            return res.send({error});
        }
    }

    //refatorar de acordo com a necessidade do frontEnd

    async change(req: ReqProps, res: Response){

        const user = await knex("users")
        .where('id', String(req.userId))
        .first();

        try {

            if(!user){
                return res.json({error: "Usuário não encontrado."});
            }

            const mailerCreate = new MailerCreate();
            const message = {
                from: process.env.USERNAME_HOST,
                to: user.email,
                subject: "Mudar senha",
                text: "Clique no botão abaixo",
                html: `
                    <h2>Olá ${user.name}, Clique no botão para mudar sua senha.</h2>
                    <a href=${process.env.API_URL_PRODUCTION}/change_password/${user.id}>Mudar senha</a>
                `
            };

            await mailerCreate.send({
                message
            });


        } catch (error) {
            return res.json({ error });
        }
    }

    async changePassword(req: Request, res: Response){
        const { id } = req.params;

        try {

        } catch (error) {
            return res.json({ error });
        }
        return res.json({id});
    }

    async changePass(req: Request, res: Response){

        const { id } = req.query;

        const {
            password,
            passwordRepeat
        } = req.body;

        try {

            if(password !== passwordRepeat){
                return res.json({ error: "Senhas não são iguais." });
            }

            const trx = await knex.transaction();

            const passwordEncripted = await bcrypt.hash(password, 10);

            const userBefore = trx('users')
            .where('id', String(id))
            .first();

            const user = await trx('users')
            .where('id', String(id))
            .first()
            .update({
                password: passwordEncripted
            })

            await trx.commit();

            return res.json({ message: "Senha atualizada..." });
        } catch (error) {
            return res.json({ error });
        }
    }

    async accountRecuperation(req: Request, res: Response){
        const {
            email,
        } = req.query;

        console.log(email);
        try {
            const mailerCreate = new MailerCreate();


            const user = await knex('users')
            .where('email', String(email))
            .first();

            if(!user){
                return res.json({ error: "Usuário não cadastrado." });
            }

            const message = {
                from: process.env.USERNAME_HOST,
                to: user.email,
                subject: "Mudar senha",
                text: "Clique no botão abaixo",
                html: `
                    <h2>Olá ${user.name}.</h2>
                    <h4>Clique no botão abaixo para mudar sua senha.</h4>
                    <a href=${process.env.API_URL_PRODUCTION}/change_password/${user.id}>Mudar senha</a>
                `
            };

            await mailerCreate.send({
                message
            })

        } catch (error) {
            return res.json({ error });
        }
    }

    //refatoração até aqui...
}

export { CreateUser }