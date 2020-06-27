const express = require('express');
const app = express();
const auth = require('./authentication/authentication');
const config = require('./config/config.json');
const dbConnector = require('./db/dbConnector');
const userController = require('./controller/userController');

app.use(express.json());

app.get('/api/users', auth.authenticateToken, async (req, res) => {
    const data = await dbConnector.selectAllUsers();
    res.json(data);
});

app.post('/login', async (req, res) => {
   const user = await userController.login(req.body.user);

   if (user == null) return res.sendStatus(401);
   if (user === 'wrong format') return res.sendStatus(400);
   if (user._id) return res.json({accessToken: await auth.sign(user)});
});

app.post('/register', async (req, res) => {
    if (!req.body.user) return res.sendStatus(400);

    const result = await userController.register(req.body.user);

    if (result) return res.sendStatus(201);
    else return res.sendStatus(400);
});

app.listen(config.web.port, () => console.log(`Listening on port ${config.web.port}`));