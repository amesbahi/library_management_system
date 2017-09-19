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
    const bookQuery = Book.findAll({ order: [["first_published", "DESC"]] });
    const patronQuery = Patron.findAll({ order: [["last_name"]] });
    const today = moment().format("YYYY-MM-D");
    const sevenDaysFromNow = moment().add(7, 'days').format("YYYY-MM-D");
    Promise.all([bookQuery, patronQuery]).then(results => {
        console.log(results[0]);
        res.render('new_loan', {
            books: results[0],
            patrons: results[1],
            today: today,
            sevenDaysFromNow: sevenDaysFromNow
        });
    });
});

// POST a new loan
router.post('/new', (req, res, next) => {
    console.log(req.body);
    Loan.create(req.body).then((newLoan) => {
        res.redirect('/loans');
    }).catch(err => {
        const bookQuery = Book.findAll({ order: [["first_published", "DESC"]] });
        const patronQuery = Patron.findAll({ order: [["last_name"]] });
        const today = moment().format("YYYY-MM-D");
        const sevenDaysFromNow = moment().add(7, 'days').format("YYYY-MM-D");
        Promise.all([bookQuery, patronQuery]).then(results => {
            console.log(results[0]);
            if (err.name) {
                console.log(err.errors);
                res.render('new_loan', {
                    books: results[0],
                    patrons: results[1],
                    today: today,
                    sevenDaysFromNow: sevenDaysFromNow,
                    errors: err.errors
                });
            } else {
                console.log('Error: ' + err);
                res.status(500).send(err);
            }
        });
    });
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