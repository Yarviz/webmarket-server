const jwt = require('jsonwebtoken');

const TOKEN_SECRET = "testTokenSecret";

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).send("Unauthorized");
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).send("No authorization header");
    }
};

module.exports = {
    authenticateJWT
}