// tidy this file up

'use strict';

const express = require('express');
const moment = require('moment');
const router = express.Router();
const Book = require('../models').Book;
const Loan = require('../models').Loan;
const Patron = require('../models').Patron;

let filter;

let bookQuery;

// GET new patron page
router.get('/new', (req, res, next) => {
    console.log("this is the new patron page");
    console.log(req.query);
    console.log(typeof req.query);
    res.render('new_patron');
});

// GET all patrons
router.get('/', (req, res, next) => {
    console.log('these are all the patrons');

    Patron.findAll({
        order: [["last_name"]]
    }).then((patrons) => {
        res.render('all_patrons', {
            patrons: patrons,
            title: 'Patrons'
        });
    });
});

module.exports = router;