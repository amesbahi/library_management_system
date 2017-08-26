'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const sequelize = require('./models').sequelize;

const Book = require('./models').Book;

// routes
const homeRoute = require('./routes/index');
const allBooks = require('./routes/books');
const allPatrons = require('./routes/patrons');
const allLoans = require('./routes/loans');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/', homeRoute);
app.use('/books', allBooks);
app.use('/patrons', allPatrons);
app.use('/loans', allLoans);

module.exports = app;
