const config = require('../config/config.json');
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${config.db.login}:${config.db.password}@passwordmanager-fjy1r.mongodb.net/test?retryWrites=true&w=majority`;
const logger = require('../logger/logger').logger;

const connect = async () => {
    try {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        logger.info(`Connected to the database.`);

        return client;
    }
    catch (e) {
        logger.error(`Cannot connect to the database. Error: ${e}`)
        return 'error';
    }
}

const close = (client) => {
    client.close().then(() => logger.info(`Connection to the database closed.`));
}

exports.selectUser = async (email) => {
    try {
        const client = await connect();
        const db = client.db(`Users`)
        const collection = db.collection("users");
        const data = await collection.findOne({'email': email});

        close(client);
        if (data) logger.info(`Found user ${data._id} in the database ${db.databaseName} and collection ${collection.collectionName}.`)
        return data;
    }
    catch (e) {
        logger.error(`Cannot select items from database Users and collection users. Error: ${e}`)
    }
}

exports.selectAllUsers = async () => {
    try {
        const client = await connect();
        const db = client.db(`Users`);
        const collection = db.collection(`users`);
        const data = await collection.find().toArray();

        close(client);

        return data;
    }
    catch (e) {
        logger.error(`Cannot select items from database  and collection . Error: ${e}`)
    }
}

exports.insertUser = async (user) => {
    try {
        const client = await connect();
        const db = client.db(`Users`);
        const collection = db.collection(`users`);

        const result = await collection.insertOne(
            {
                'email': user.email,
                'password': user.password
            });

        if (result) logger.info(`Successfully added user ${result.insertedId} to the database.`)
        close(client);
        return result.insertedId;
    }
    catch (e) {
        logger.error(`Cannot insert item to the database Users and collection users. Error: ${e}`)
        return false;
    }
}