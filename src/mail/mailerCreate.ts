import nodeMailer from 'nodemailer';
const sgMail = require('@sendgrid/mail');

interface MailerProps{
    message: {
        from: string;
        to: string;
        subject: string;
        text?: string;
        html: any
    }
}

class MailerCreate{

    async send({message}: MailerProps){

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        sgMail
        .send(message)
        .then((message) => {
            console.log(message);
        })
        .catch((error) => {
            console.error(error)
        })

    }

}

export { MailerCreate }