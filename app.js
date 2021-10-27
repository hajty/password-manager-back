const express = require('express');
const auth = require('./authentication/authentication');
const config = require('./config/config.js');
const userController = require('./controller/userController');
const passwordController = require('./controller/passwordController');

const app = express();
const port = process.env.PORT || config.web.port;

app.use(express.json());

app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://hajtys-password-manager.herokuapp.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
    }

    next();
});

app.post('/login', async (req, res) => {
    const user = await userController.login(req.body.user);

    if (user == null) return res.sendStatus(401);
    if (user === 'wrong format') return res.sendStatus(400);
    if (user._id) return res.json({
        accessToken: await auth.sign(user),
        refreshToken: await auth.signRefresh(user),
        expiresIn: config.auth.expiresIn,
    });
});

app.post('/register', async (req, res) => {
    if (!req.body.user) return res.status(400).end('Wrong body format');

    const result = await userController.register(req.body.user);

    if (result === 'already exists') return res.status(409).end('User already exists');
    if (result) return res.status(201).send({ id: result});
});

app.get('/token', auth.authenticateRefreshToken, async (req, res) => {
    const user =
        {
            _id: req.user._id,
            email: req.user.email,
            password: req.user.password,
        }
    return res.json({
        accessToken: await auth.sign(user),
        refreshToken: await auth.signRefresh(user),
        expiresIn: config.auth.expiresIn,
    });
});

app.post('/api/passwords/', auth.authenticateToken, passwordController.passwordMiddleware, async (req, res) => {
    const result = await passwordController.create(req.user._id, req.body.password);

    if (result) {
        req.body.password._id = result;
        res.status(201).send(req.body.password);
    }
    else return res.sendStatus(400);
});

app.get('/api/passwords/', auth.authenticateToken, async (req, res) => {
   const data = await passwordController.read(req.user._id);

   if (data) return res.send(data);
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

app.patch('/api/password/:passwordId', auth.authenticateToken, async (req, res) => {
    if (!req.params.passwordId || !req.body.parametersToUpdate) res.sendStatus(400);
    const result = await passwordController.update(req.user._id, req.params.passwordId, req.body.parametersToUpdate);
    if (result) return res.sendStatus(204);
    else return res.sendStatus(404);
});

app.delete('/api/password/:passwordId', auth.authenticateToken, async (req, res) => {
    if (!req.params.passwordId) res.sendStatus(400);

    const result = await passwordController.delete(req.user._id, req.params.passwordId);
    if (result) return res.sendStatus(204);
    else return res.sendStatus(404);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
