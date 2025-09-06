const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const app = express();
const morgan = require('morgan');
require('dotenv').config();
// const bodyParser = require('body-parser');

// initialize middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
// app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.par);
const { countConnect, checkOverload } = require('./helpers/check.connect.js');
const router = require('./routes/index.js');

// initialize database
require('./dbs/init.mongodb.js');
// countConnect();
// checkOverload();

// initialize routes
app.use('/v1/api', router);

// handling errors
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: err.stack,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
