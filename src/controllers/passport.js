const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const userModel = require('../models/user.model');
const { v4: uuid4 } = require('uuid');
const argon2 = require('argon2');
require('dotenv').config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.SERVER_URL}:${process.env.PORT}/auth/google/callback`,
        },
        async function (accessToken, refreshToken, profile, cb) {
            const email = profile.emails[0].value;
            const name = profile.displayName;
            const user = await userModel.findOne({ email });
            if (user) {
                return cb(null, user);
            } else {
                const user = await userModel.create({
                    email,
                    name,
                    password: await argon2.hash(uuid4()),
                });
                return cb(null, user);
            }
        }
    )
);

module.exports = passport;
