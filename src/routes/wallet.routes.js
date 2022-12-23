const app = require('express').Router();
const verifyUser = require('../middlewares/verifyUser');
// wallet balance of user
// add money
// pay money to another person
// payment deducted and recieved messages

app.use(verifyUser);

app.get('/', async (req, res) => {
    
});

module.exports = app;
