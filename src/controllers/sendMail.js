const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMail = async (email, payload) => {
    let transporter = nodemailer.createTransport({
        pool: true,
        service: 'gmail',
        auth: {
            user: process.env.USER,
            pass: process.env.PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
        port: 465,
        host: 'smtp.gmail.com',
    });

    let mailOptions = {
        from: process.env.USER,
        to: `${email}`,
        subject: `${payload.subject}`,
        text: `${payload.text}`,
    };

    transporter.sendMail(mailOptions, (err, success) => {
        if (err) console.log(err);
        else console.log('Email Sent');
    });
};

module.exports = sendMail;
