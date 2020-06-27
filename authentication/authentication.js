const jwt = require('jsonwebtoken');
const { authentication } = require('../config/config.json')

exports.sign = async (user) => {
    return jwt.sign(user, authentication.accessToken, {expiresIn: "1m"});
}

exports.authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (token == null) return res.sendStatus(401);

    try {
        req.user = jwt.verify(token, authentication.accessToken);
        next();
    }
    catch (e) {
        return res.sendStatus(403);
    }
}