const express = require('express');
const app = express();
const config = require('./config');
const controller = require('./controller');

// Download image from CDN, resize and optimize
app.get('/', controller);

app.listen(config.server.port);
console.log('Listening on port ' + config.server.port);

module.exports = app;
