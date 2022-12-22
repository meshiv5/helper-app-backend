const jwt = require('jsonwebtoken');

const signToken = (user) => {
    const token = jwt.sign(
        {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '24h',
        }
    );
    return token;
};

module.exports = signToken;
