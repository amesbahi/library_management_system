// tidy this file up

'use strict';

const express = require('express');
const moment = require('moment');
const router = express.Router();
const Book = require('../models').Book;
const Loan = require('../models').Loan;
const Patron = require('../models').Patron;

let filter;

let loanQuery;

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
    console.log(req.query);
    console.log(typeof req.query);
    if (req.query.filter === undefined) {
        loanQuery = Loan.findAll({
            include: [
                { model: Patron },
                { model: Book }
            ],
            order: [["loaned_on"]]
        }).then((loans) => {
            console.log(loans);
            res.render('all_loans', {
                loans: loans,
                title: 'Loans'
            });
        });
    }

    // filter for overdue loans
    // SELECT * FROM loans WHERE  loans.returned_on IS NULL AND loans.return_by <= "2017-08-29"
    console.log(moment().format("YYYY-MM-DD"))
    if (req.query.filter === 'overdue') {
        loanQuery = Loan.findAll({
            include: [
                { model: Patron },
                { model: Book }
            ],
            where: {
                returned_on: null,
                return_by: {
                    lte: moment().format("YYYY-MM-DD")
                }
            },
            order: [["return_by", "DESC"]]
        }).then((overdueLoans) => {
            res.render('overdue_loans', {
                overdueLoans: overdueLoans,
                title: 'Overdue Loans'
            });
        });
    }

    // filter for checked out loans
    // SELECT * FROM loans WHERE  loans.returned_on IS NULL
    if (req.query.filter === 'checked_out') {
        loanQuery = Loan.findAll({
            include: [
                { model: Patron },
                { model: Book }
            ],
            where: {
                returned_on: null
            },
            order: [["return_by", "DESC"]]
        }).then((checkedOutLoans) => {
            res.render('checked_loans', {
                checkedOutLoans: checkedOutLoans,
                title: 'Checked Out Books'
            });
        });
    }
});

module.exports = router;