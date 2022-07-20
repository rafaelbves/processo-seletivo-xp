require('express-async-errors');
const express = require('express');

const router = require('./routes')
const app = express()
const bodyParser = require('body-parser');
const { errorHandler } = require('./middleware/errorHandler');

app.use(bodyParser.json());
app.use(router);
app.use(errorHandler);

module.exports = app;
