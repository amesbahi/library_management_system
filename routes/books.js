'use strict';

const express = require('express');
const moment = require('moment');
const router = express.Router();
const Book = require('../models').Book;
const Loan = require('../models').Loan;
const Patron = require('../models').Patron;

let filter;

// GET all books
router.get('/', (req, res, next) => {
    if (req.query.filter === undefined) {
        Book.findAll({ order: [["first_published", "DESC"]] }).then((books) => {
            res.render('all_books', {
                books: books,
                title: 'Books'
            });
        });
    }

    if (req.query.filter === 'overdue') {
        Book.findAll({
            include: [{
                model: Loan,
                where: {
                    returned_on: null,
                    return_by: {
                        lte: moment().format("YYYY-MM-DD")
                    }
                }
            }],
            order: [["first_published", "DESC"]]
        }).then((overdueBooks) => {
            res.render('overdue_books', {
                overdueBooks: overdueBooks,
                title: 'Overdue Books'
            });
        });
    }

    // filter for checked out books
    if (req.query.filter === 'checked_out') {
        Book.findAll({
            include: [{
                model: Loan,
                where: {
                    returned_on: null
                }
            }],
            order: [["first_published", "DESC"]]
        }).then((checkedBooks) => {
            res.render('checked_books', {
                checkedBooks: checkedBooks,
                title: 'Checked Out Books'
            });
        });
    }
});

// GET new book form
router.get('/new', (req, res, next) => {
    res.render('new_book');
});

// POST a book to the database
router.post('/new', (req, res, next) => {
    const title = req.body.title;
    const author = req.body.author;
    const genre = req.body.genre;
    const firstPublished = req.body.first_published;

    Book.create(req.body).then((newBook) => {
        res.redirect('/books');
    }).catch(err => {
        if (err.name === 'SequelizeValidationError') {
            res.render('new_book', {
                title: title,
                author: author,
                genre: genre,
                firstPublished: firstPublished,
                errors: err.errors
            });
        } else {
            res.status(500).send(err);
        }
    })
});

// GET the book detail page
router.get('/:id', (req, res, next) => {
    const getBook = Book.findOne({
        where: [
            { id: req.params.id }
        ]
    });

    const getLoans = Loan.findAll({
        where: [
            { book_id: req.params.id }
        ],
        include: [{
            model: Patron
        }],
    });

    Promise.all([getBook, getLoans]).then(results => {
        res.render('book_detail', {
            book: results[0],
            loans: results[1]
        });
    });
});

// UPDATE the book detail page
router.post('/:id/update', (req, res, next) => {
    const getBook = Book.findOne({
        where: [
            { id: req.params.id }
        ]
    });

    const getLoans = Loan.findAll({
        where: [
            { book_id: req.params.id }
        ],
        include: [{
            model: Patron
        }],
    });

    Promise.all([getBook, getLoans]).then(results => {
        Book.update(req.body, { where: [{ id: req.params.id }] }).then((newBook) => {
            res.redirect('/books');
        }).catch(err => {
            if (err.name === 'SequelizeValidationError') {
                res.render('book_detail', {
                    book: results[0],
                    loans: results[1],
                    errors: err.errors
                });
            } else {
                res.status(500).send(err);
            }
        })
    });
});

// GET return book page
router.get('/:id/return', (req, res, next) => {
    const today = moment().format("YYYY-MM-D");
    const loanQuery = Loan.findOne({
        where: [{ book_id: req.params.id }],
        include: [
            { model: Patron },
            { model: Book }
        ]
    }).then((loan) => {
        res.render('return_book', {
            loan: loan,
            today: today
        });
    });
});

// POST return book page
router.post('/:id/return', (req, res, next) => {
    const errors = [];
    if (!req.body.returned_on) {
        errors.push('Please add a returned on date!');
    }
    if (errors.length > 0) {
        const today = moment().format("YYYY-MM-D");
        const loanQuery = Loan.findOne({
            where: [{ book_id: req.params.id }],
            include: [
                { model: Patron },
                { model: Book }
            ]
        }).then((loan) => {
            res.render('return_book', {
                loan: loan,
                today: today,
                errors: errors
            });
        });
    } else {
        // update the loan as returned
        Loan.update(req.body, { where: [{ book_id: req.params.id }] }).then(() => {
            res.redirect('/loans');
        })
    }
});

module.exports = router;