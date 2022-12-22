const express = require('express');
const connect = require('./config/db');
require('dotenv').config();
const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const authRouter = require('../src/routes/auth.routes');

app.get('/', (req, res) => {
    res.send('Namaste');
});

app.use('/auth', authRouter);

app.listen(port, () => {
    connect();
    console.log(`Listening on ${process.env.SERVER_URL}:${port}`);
});
