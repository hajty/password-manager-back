const express = require('express');
const auth = require('./authentication/authentication');
const config = require('./config/config.json');
const userController = require('./controller/userController');
const passwordController = require('./controller/passwordController');

const app = express();

app.use(express.json());

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

app.post('/api/passwords/', auth.authenticateToken, passwordController.passwordMiddleware, async (req, res) => {
    const result = await passwordController.create(req.user._id, req.body.password);

    if (result) return res.sendStatus(201);
    else return res.sendStatus(400);
});

app.listen(config.web.port, () => console.log(`Listening on port ${config.web.port}`));