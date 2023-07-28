const Sib = require('sib-api-v3-sdk')

const client = Sib.ApiClient.instance

const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.SENDGRID_API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi()

const sender = {
    email: 'mdibrahimhaf6996@gmail.com',
    name: 'Ibrahim',
}

exports.sendEmail = async (email, resetUrl) => {
    const receivers = [
        {
            email
        },
    ];

    await tranEmailApi
    .sendTransacEmail({
        sender,
        to: receivers,
        subject: 'Hello Blog App',
        textContent: `
        Hello Blog App
        `,
        htmlContent: resetUrl,
        params: {
            role: 'Frontend',
        },
    })
    .then(res=> console.log(res))
    .catch(e=> console.log(e))
}