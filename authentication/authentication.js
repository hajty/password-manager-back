const jwt = require('jsonwebtoken');
const { auth } = require('../config/config.json')

exports.sign = async (user) => {
    return jwt.sign(user, auth.accessToken, { expiresIn: auth.expiresIn });
}

exports.signRefresh = async (user) => {
    return jwt.sign(user, auth.refreshToken, { expiresIn: auth.expiresIn });
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

exports.authenticateRefreshToken = (req, res, next) => {
    const refreshToken = req.headers['authorization'];

    if (refreshToken == null) return res.sendStatus(401);

    try {
        req.user = jwt.verify(refreshToken, auth.refreshToken);
        next();
    }
    catch (e) {
        return res.sendStatus(403);
    }
}
