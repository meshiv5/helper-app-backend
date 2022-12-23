const app = require('express').Router();
const verifyUser = require('../middlewares/verifyUser');
const serviceModel = require('../models/service.model');
const userModel = require('../models/user.model');
const mongoose = require('mongoose');

app.use(verifyUser);

app.get('/', async (req, res) => {
    try {
        const {
            query = '',
            filter = '',
            order = 1,
            limit = 10,
            page = 1,
            role = 'buyer',
        } = req.query;
        const { user } = req.body;
        let services;
        services = await serviceModel.aggregate([
            {
                $match:
                    role == 'seller'
                        ? { employer: mongoose.Types.ObjectId(user.id) }
                        : {
                              employer: {
                                  $ne: mongoose.Types.ObjectId(user.id),
                              },
                          },
            },
            { $match: { task: { $regex: query, $options: 'i' } } },
            {
                $match: filter ? { category: filter } : {},
            },
            {
                $sort: { pay: +order },
            },
            { $skip: +(limit * (+page - 1)) },
            { $limit: +limit },
        ]);
        await userModel.populate(services, {
            path: 'employer',
            select: { name: 1, email: 1 },
        });
        return res.status(200).send(services);
    } catch {
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

//needs better error handling
app.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { user, task, description, category, pay } = req.body;
        const service = await serviceModel.findById(id);
        if (
            service.employer.toString() ==
            mongoose.Types.ObjectId(user.id).toString()
        ) {
            await serviceModel.findByIdAndUpdate(id, {
                task,
                category,
                description,
                pay: +pay,
            });
            return res.status(200).send('Service updated');
        }
        return res.status(403).send('Forbidden');
    } catch (e) {
        console.log(e);
        return res.status(400).send('Bad request');
    }
});

app.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req.body;
        const service = await serviceModel.findById(id);
        if (
            service.employer.toString() ==
            mongoose.Types.ObjectId(user.id).toString()
        ) {
            await serviceModel.findByIdAndDelete(id);
            return res.status(200).send('Service deleted');
        }
        return res.status(403).send('Forbidden');
    } catch {
        return res.status(400).send('Bad request');
    }
});

module.exports = app;
