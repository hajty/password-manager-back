const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  web: {
    port: 3000
  },
  db: {
    login: process.env.DB_LOGIN,
    password: process.env.DB_PASSWORD
  },
  auth: {
    accessToken: process.env.AUTH_ACCESSTOKEN,
    refreshToken: process.env.AUTH_REFRESHTOKEN,
    expiresIn: 300
  }
};
