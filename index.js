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
   if (user._id) return res.json({
       accessToken: await auth.sign(user),
       expiresIn: config.auth.expiresIn
   });
});

app.post('/register', async (req, res) => {
    if (!req.body.user) return res.status(400).send('Wrong format.');

    const result = await userController.register(req.body.user);

    if (result === 'already exists') return res.status(400).send('User already exists.');
    if (result) return res.status(201).send('Successfully registered.');
});

app.post('/api/passwords/', auth.authenticateToken, passwordController.passwordMiddleware, async (req, res) => {
    const result = await passwordController.create(req.user._id, req.body.password);

    if (result) return res.sendStatus(201);
    else return res.sendStatus(400);
});


app.get('/api/passwords/', auth.authenticateToken, async (req, res) => {
   const data = await passwordController.read(req.user._id);

   if (data) return res.send({passwords: data});
   else res.sendStatus(500);
});

app.get('/api/password/:passwordId', auth.authenticateToken, async (req, res) => {
    const password = await passwordController.readOne(req.user._id, req.params.passwordId);
    if (password) return res.send({password: password});
    else res.sendStatus(500);
});

app.get('/api/password/', auth.authenticateToken, async (req, res) => {
   if (!req.body.passwordId) res.sendStatus(400);

    const password = await passwordController.readOne(req.user._id, req.body.passwordId);
    if (password) return res.send({password: password});
    else res.sendStatus(500);
});

app.listen(config.web.port, () => console.log(`Listening on port ${config.web.port}`));