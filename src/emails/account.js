import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const myEmail = 'realnimiliu@gmail.com'

export const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: myEmail,
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. I'm Minxuan!`
    })
}

export const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: myEmail,
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`
    })
}