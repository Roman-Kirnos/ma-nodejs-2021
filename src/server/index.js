/* eslint-disable consistent-return */
const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');

const router = require('./router');
const {
  server: { HOST, PORT },
  user,
} = require('../config');

const app = express();

app.use(bodyParser.json({ strict: false, type: '*/*' }));
app.use(bodyParser.urlencoded({ extended: true }));

const basicAuthOptions = {
  users: { [user.NAME]: user.PASSWORD },
  unauthorizedResponse: { message: 'Unauthorized' },
};

app.use(basicAuth(basicAuthOptions), router);

let server;

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.error({ error }, 'Global catch errors');

  let errMessage = { message: 'Internal server error!' };
  if (!(parseInt(error.status, 10) === 500) && error.message) {
    res.status(error.status);
    errMessage = { message: error.message };
  } else {
    res.status(500);
  }

  res.json(errMessage);
});

function startServer() {
  server = app.listen(PORT, HOST, () => {
    console.log(`Server is listening on "${HOST}:${PORT}"!`);
  });
}

function stopServer(callback) {
  if (!server) return console.error('Server is not running');

  server.close(err => {
    if (err) {
      console.error(err, 'failed to close server');
      callback();
      return;
    }

    console.log('\n\nServer is stopped!\n');
    callback();
  });
}

module.exports = { startServer, stopServer };
