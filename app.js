const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { resourcePath } = require('./config/index')

const bodyParser = require('body-parser')
const routes = require('./routes/index')

const app = express();
app.use(bodyParser.json())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, resourcePath)));


app.use('/', routes);


module.exports = app;
