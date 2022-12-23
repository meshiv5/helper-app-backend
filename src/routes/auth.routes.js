const app = require('express').Router();
const userModel = require('../models/user.model');
const argon2 = require('argon2');
const signToken = require('../controllers/signToken');
const passport = require('../controllers/passport');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const sendMail = require('../controllers/sendMail');

app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        await userModel.create({
            name,
            email,
            password: await argon2.hash(password),
        });
        return res.status(201).send('Account created');
    } catch {
        return res.status(400).send('Bad request');
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({
            email,
        });
        if (await argon2.verify(user.password, password)) {
            const token = signToken(user);
            return res.status(200).send({ token, message: 'Login success' });
        }
        return res.status(401).send('Unauthorized');
    } catch {
        return res.status(400).send('Bad request');
    }
});

app.get(
    '/google',
    passport.authenticate('google', {
        scope: ['email', 'profile'],
    })
);

app.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login',
        session: false,
    }),
    (req, res) => {
        res.send(signToken(req.user));
    }
);

//change link url
app.post('/forgot-password', async (req, res) => {
    try {
        let { email } = req.body;
        let user = await userModel.findOne({ email });
        if (!user) return res.status(404).send('Email not found');
        const secret = process.env.FORGOT_PASSWORD_SECRET + user.password;
        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            secret,
            {
                expiresIn: '900s',
            }
        );
        const link = `https://helper-app-two.vercel.app/auth/reset-password/${user.id}/${token}`;
        sendMail(email, {
            subject: 'Reset password',
            text: `Please click on this ${link} to reset password`,
        });
        return res.status(200).send('Email sent');
    } catch {
        return res.status(400).send('Bad Request');
    }
});

app.post('/reset-password/:id/:token', async (req, res) => {
    try {
        const { id, token } = req.params;
        const { newPassword } = req.body;
        let user = await userModel.findById(id);
        if (!user) return res.status(404).send('Invalid id');
        const secret = process.env.FORGOT_PASSWORD_SECRET + user.password;
        jwt.verify(token, secret);
        await user.update({ password: await argon2.hash(newPassword) });
        return res.status(200).send('Password updated');
    } catch {
        return res.send(403).send('Forbidden');
    }
});

module.exports = app;
