import nodeMailer from 'nodemailer';

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

        // const transporter = nodeMailer.createTransport({
        //     port: 465,
        //     host: 'mail.markwolfarts.com',
        //     service: 'smtp',
        //     auth: {
        //       user: 'markwolf@markwolfarts.com',
        //       pass: 'G1f4En2pu8'
        //     }
        // });
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.USERNAME_HOST,
              pass: process.env.PASSWORD_USER
            }
        });

        transporter.sendMail(message).then((message) => {
            console.log(message);
        }).catch(err => {
            console.log(err);
        })

    }

}

export { MailerCreate }