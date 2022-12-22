const jwt = require('jsonwebtoken');

const verifyUser = (req, res, next) => {
    try {
        const token = req.headers['authorization'];
    const details = jwt.decode('')
    }
    catch {
        return res.status()
    }
};

module.exports = verifyUser;
