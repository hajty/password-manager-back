# Password Manager Back-end

## About
Password Manager back-end application allows users to create account and store their passwords. Application communicates receiving GET, POST, PATCH and DELETE REST JSON requests and responding with suitable data and http response codes.

Requests to the API require JWT token which user gets after success log in.

## Usage

***DEMO front-end application hosted on Heroku [here](https://hajtys-password-manager.herokuapp.com)*** (it may take few seconds to launch and then first request to api, because Heroku shutdowns applications after 30 minutes of inactivity).

E-mail address of course does not need to be valid, there are no registration links etc.

## How to get work with this project

This application has been made to communicate with my own front-end API application which you can find [here](https://github.com/hajty/password-manager-front).

### Installation
Simply `git clone` the project and run `npm install`.\
Module Argon2 may require additional installation, inctruction [here](https://github.com/ranisalt/node-argon2#before-installing).
  
## Used technologies
- Node.js
- Express
- MongoDB
- JavaScript
