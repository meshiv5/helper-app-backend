const express = require('express');
const connect = require('./config/db');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const authRouter = require('../src/routes/auth.routes');
const serviceRouter = require('../src/routes/service.routes');

app.get('/', (req, res) => {
    res.send('Namaste');
});

app.use('/auth', authRouter);
app.use('/service', serviceRouter);

app.listen(port, () => {
    connect();
    console.log(`Listening on ${process.env.SERVER_URL}${port}`);
});
