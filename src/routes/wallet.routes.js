const app = require('express').Router();
const sendMail = require('../controllers/sendMail');
const verifyUser = require('../middlewares/verifyUser');
const userModel = require('../models/user.model');

app.use(verifyUser);

app.get('/', async (req, res) => {
    try {
        const { user } = req.body;
        const userDetails = await userModel.findById(user.id);
        return res.status(200).send(userDetails.balance.toString());
    } catch {
        return res.status(400).send('Bad request');
    }
});

app.patch('/add', async (req, res) => {
    try {
        let { user, amount } = req.body;
        let userDetails = await userModel.findById(user.id);
        amount = +amount;
        if (amount > 0 && typeof amount == 'number') {
            await userDetails.update({ balance: amount + userDetails.balance });
            return res.status(200).send(`Added ${amount} to wallet`);
        }
        return res.status(400).send('Bad request');
    } catch {
        return res.status(400).send('Bad request');
    }
});

app.patch('/pay', async (req, res) => {
    try {
        let { user, amount, to } = req.body;
        amount = +amount;
        if (amount <= 0 || typeof amount != 'number')
            return res.status(400).send('Invalid amount');
        let userDetails = await userModel.findById(user.id);
        let bearerDetails = await userModel.findById(to);
        if (!bearerDetails) {
            return res.status(400).send("Bearer doesn't exisit");
        }
        if (amount > userDetails.balance) {
            return res.status(406).send('Insufficient balance');
        }
        await userDetails.update({ balance: userDetails.balance - amount });
        await bearerDetails.update({ balance: bearerDetails.balance + amount });
        await sendMail(userDetails.email, {
            subject: `Amount ${amount} payed to ${bearerDetails.name}`,
        });
        await sendMail(bearerDetails.email, {
            subject: `Amount ${amount} recieved from ${userDetails.name}`,
        });
        return res
            .status(200)
            .send(`Amount ${amount} payed to ${bearerDetails.name}`);
    } catch {
        return res.status(400).send('Bad request');
    }
});

module.exports = app;
