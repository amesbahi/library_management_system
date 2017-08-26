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

// GET new loan page
router.get('/new', (req, res, next) => {
    console.log("this is the new loan page");
    console.log(req.query);
    console.log(typeof req.query);
    res.render('new_loan');
});

// GET all loans
router.get('/', (req, res, next) => {
    console.log('these are all the loans');

    Loan.findAll({
        include: [{
            model: Patron,
            include: [{
                model: Book
            }]
        }],
        order: [["loaned_on"]]
    }).then((loans) => {
        res.render('all_loans', {
            loans: loans,
            title: 'Loans'
        });
    });
});

module.exports = router;