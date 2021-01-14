const argon2 = require('argon2');
const dbConnector = require('../db/dbConnector');
const logger = require('../logger/logger').logger;
const emailValidator = require('email-validator');
const PasswordValidator = require('password-validator');
const passwordValidator = new PasswordValidator();

passwordValidator
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                                   // Must have uppercase letters
    .has().lowercase()                                   // Must have lowercase letters
    .has().digits()                                      // Must have digits
    .has().not().spaces()                                // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']);  // Blacklist these values

exports.register = async (user) => {
    try {
        const isEmail = await emailValidator.validate(user.email);
        const isPassword = await passwordValidator.validate(user.password);

        if (!(isEmail && isPassword)) return false;

        if (await dbConnector.selectUser(user.email)) return 'already exists';

        user.password = await argon2.hash(user.password);
        const result = await dbConnector.insertUser(user);

        if (result) {
            logger.info(`Successfully registered user: ${result}.`);
            return result;
        }
    }
    catch (e) {
        logger.error(`Couldn't register new user. Error: ${e}`);
    }
    return false;
}

exports.login = async (user) => {
    try {
        const isEmail = await emailValidator.validate(user.email);
        const isPassword = await passwordValidator.validate(user.password);

        if (!(isEmail && isPassword)) return 'wrong format';

        const User = await dbConnector.selectUser(user.email);

        if (User == null) return null;
        if (await argon2.verify(User.password, user.password)) return User;
        else return null;
    }
    catch (e) {
        logger.error(`Error in function login. Error: ${e}`);
    }
}