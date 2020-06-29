const jwt = require('jsonwebtoken');
const { auth } = require('../config/config.json')

exports.sign = async (user) => {
    return jwt.sign(user, auth.accessToken, {expiresIn: "10m"});
}

exports.authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (token == null) return res.sendStatus(401);

    try {
        req.user = jwt.verify(token, auth.accessToken);
        next();
    }
    catch (e) {
        return res.sendStatus(403);
    }
}