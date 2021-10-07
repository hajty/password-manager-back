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

exports.read = async (userId) => {
    try {
        const data = await dbConnector.selectAllPasswords(userId);

        if (data) {
            logger.info(`Successfully read passwords list for user ${userId}.`);
            return data;
        }
        else return null;
    }
    catch (e) {
        logger.error(`Couldn't read passwords list for user ${userId}`);
        return null;
    }
}

exports.readOne = async (userId, passwordId) => {
    try {
        const data = await dbConnector.selectPassword(userId, passwordId);
        if (data) {
            logger.info(`Successfully read password ${passwordId} for user ${userId}.`);
            return data
        }
        else return null;
    }
    catch (e) {
        logger.error(`Couldn't read password ${passwordId} for user ${userId}.`);
        return null;
    }
}

exports.update = async (userId, passwordId, parameterToUpdate) => {
    try {
        const result = await dbConnector.updatePassword(userId, passwordId, parameterToUpdate);
        if (result) {
            logger.info(`Successfully updated password ${passwordId} for user ${userId}.`);
            return result;
        }
        else return null;
    }
    catch (e) {
        logger.error(`Couldn't update password ${passwordId} for user ${userId}.`);
        return null;
    }
}

exports.delete = async (userId, passwordId) => {
    try {
        const result = await dbConnector.deletePassword(userId, passwordId);
        if (result) {
            logger.info(`Successfully deleted password ${passwordId} for user ${userId}.`);
            return result;
        }
        else return null;
    }
    catch (e) {
        logger.error(`Couldn't delete password ${passwordId} for user ${userId}.`);
        return null;
    }
}
