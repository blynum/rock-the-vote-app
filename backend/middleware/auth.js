const { expressjwt: jwt } = require('express-jwt');
const dotenv = require('dotenv');
dotenv.config();

const authenticate = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    requestProperty: 'auth' // The payload will be available in req.auth
});

module.exports = authenticate;
