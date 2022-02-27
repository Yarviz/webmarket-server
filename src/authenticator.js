require('dotenv').config();
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send("No authorization header");
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err || user.userId != req.params.userId) {
            return res.status(401).send("Unauthorized");
        }
        req.user = user;
        next();
    });
};

module.exports = {
    authenticateJWT
}