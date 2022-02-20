const jwt = require('jsonwebtoken');

const TOKEN_SECRET = "testTokenSecret";

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send("No authorization header");
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err || user.userId != req.params.userId) {
            return res.status(403).send("Unauthorized");
        }
        req.user = user;
        next();
    });
};

module.exports = {
    authenticateJWT
}