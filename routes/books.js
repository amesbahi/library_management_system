'use strict';

const express = require('express');
const moment = require('moment');
const router = express.Router();
const Book = require('../models').Book;
const Loan = require('../models').Loan;
const Patron = require('../models').Patron;


let bookQuery;

// GET all books
router.get('/', (req, res, next) => {
    console.log("these are the books");
    // grab all the books
    console.log(req.query);
    console.log(typeof req.query);
    if (req.query.filter === undefined) {
        bookQuery = Book.findAll({ order: [["first_published", "DESC"]] }).then((books) => {
            console.log(books);
            res.render('all_books', {
                books: books,
                title: 'Books'
            });
        });
    }

    // filter for overdue books
    // SELECT * FROM books, loans WHERE  books.id=loans.book_id AND  loans.returned_on IS NULL AND loans.return_by <= "2017-08-17"
    console.log(moment().format("YYYY-MM-DD"))
    if (req.query.filter === 'overdue') {
        bookQuery = Book.findAll({
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
    // SELECT * FROM books, loans WHERE books.id=loans.book_id AND loans.returned_on IS NULL AND loans.return_by >= "2020-10-20"
    if (req.query.filter === 'checked_out') {
        bookQuery = Book.findAll({
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

// POST create new book
router.post('/', (req, res, next) => {
    Book.create(req.body).then((book) => {
        res.redirect('all_books' + book.id);
    });
});

module.exports = router;