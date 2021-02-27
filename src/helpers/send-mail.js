const transporter = require('../settings/nodemailer');

const activationAccount = (token) => `
    <p><b>Welcome to the MemoPad</b>, we are almost done setting up your account. Please enter the following <a href='http://${process.env.CLIENT_URL}/verifyEmail/${token}'>link</a>:</p>
    <p>This link will expire in 10 minutes.</p>
`

const forgotPassword = (token) => `
    <h2>Please click on given <a href='http://${process.env.CLIENT_URL}/resetpassword/${token}'>link</a> to reset your password</h2>
`
const body = (token, type) => {
    var message = '';
    switch(type){
        case 1: 
            message = activationAccount(token);
            break;

        case 2: 
            message = forgotPassword(token);
            break;
    }
    return message;
}

async function sendMail(email, token, type){
    try{
        await transporter.sendMail({
            from: '"Jorge" <jhernandezd95@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Hello ✔", // Subject line
            html: body(token, type)
        });
    } catch (err){
        throw err;
    }
}

module.exports = {
    sendMail
}