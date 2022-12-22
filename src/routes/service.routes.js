const app = require('express').Router();
const { isObjectIdOrHexString } = require('mongoose');
const verifyUser = require('../middlewares/verifyUser');
const serviceModel = require('../models/service.model');
const userModel = require('../models/user.model');

app.use(verifyUser);

app.get('/', async (req, res) => {
    try {
        const {
            query = '',
            filter = '',
            order = 1,
            limit = 10,
            page = 1,
        } = req.query;
        const { role, user } = req.body;
        let services;
        console.log(user.name);
        if (role == 'seller') {
            services = await serviceModel.aggregate([
                {
                    $match: {
                        employer: mongoose.Types.ObjectId(user.id),
                    },
                },
                { $match: { task: { $regex: query } } },
                {
                    $match: filter ? { category: filter } : {},
                },
                {
                    $sort: { pay: +order },
                },
                { $skip: +(limit * (+page - 1)) },
                { $limit: +limit },
            ]);
        } else {
            services = await serviceModel.aggregate([
                { $match: { employer: { $ne: user.id } } },
                { $match: { _id: user.id } },
                { $match: { task: { $regex: query } } },
                {
                    $match: filter ? { category: filter } : {},
                },
                {
                    $sort: { pay: +order },
                },
                { $skip: +(limit * (+page - 1)) },
                { $limit: +limit },
            ]);
        }
        await userModel.populate(services, {
            path: 'employer',
            select: { name: 1, email: 1 },
        });
        return res.status(200).send(services);
    } catch (e) {
        console.log(e);
        return res.status(400).send('Bad request');
    }
});

app.post('/', async (req, res) => {
    try {
        const { task, category, description, pay, user } = req.body;
        await serviceModel.create({
            task,
            category,
            description,
            employer: user.id,
            pay,
        });
        return res.status(201).send('Service created');
    } catch {
        return res.status(400).send('Bad request');
    }
});

// edit services
// forgot password

module.exports = app;
