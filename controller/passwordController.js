const dbConnector = require('../db/dbConnector');
const logger = require('../logger/logger').logger;

exports.passwordMiddleware = (req, res, next) => {
    const password = req.body.password;
    if (!(password.service && password.username && password.password)) return res.sendStatus(400);
    next();
}

exports.create = async (userId, password) => {
    try {
        const result = await dbConnector.insertPassword(userId, password);

        if (result) {
            logger.info(`Successfully created entry: ${result}.`);
            return result;
        }
    }
    catch (e) {
        logger.error(`Couldn't create new password. Error: ${e}`);
    }
    return false;
}

exports.read = () => {

}

exports.readOne = () => {

}

exports.update = () => {

}

exports.delete = () => {

}