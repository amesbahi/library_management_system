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
    // grab all the books
    if (req.query.filter === undefined) {
        Book.findAll({ order: [["first_published", "DESC"]] }).then((books) => {
            res.render('all_books', {
                books: books,
                title: 'Books'
            });
        });
    }

    // SELECT * FROM books LEFT JOIN loans ON books.id = loans.book_id WHERE (loaned_on IS NOT NULL AND returned_on IS NOT NULL) OR (loaned_on IS NULL)

    // filter for overdue books
    // SELECT * FROM books, loans WHERE  books.id=loans.book_id AND  loans.returned_on IS NULL AND loans.return_by <= "2017-08-17"
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
    // SELECT * FROM books, loans WHERE books.id=loans.book_id AND loans.returned_on IS NULL
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
    let errorMessages = [];

    const title = req.body.title;
    const author = req.body.author;
    const genre = req.body.genre;
    const firstPublished = req.body.first_published;
    if (!title) {
        errorMessages.push("Please enter a title!");
    }

    if (!author) {
        errorMessages.push("Please enter an author!");
    }

    if (!genre) {
        errorMessages.push("Please enter a genre!");
    }

    if (errorMessages.length === 0) {
        Book.create(req.body).then((newBook) => {
            res.redirect('/books');
        })
    } else {
        res.render('new_book', {
            errorMessages: errorMessages,
            title: title,
            author: author,
            genre: genre,
            firstPublished: firstPublished
        });
    }
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
    let errorMessages = [];

    const title = req.body.title;
    const author = req.body.author;
    const genre = req.body.genre;
    const firstPublished = req.body.first_published;
    if (!title) {
        errorMessages.push("Please enter a title!");
    }

    if (!author) {
        errorMessages.push("Please enter an author!");
    }

    if (!genre) {
        errorMessages.push("Please enter a genre!");
    }
    console.log('@@@@@@@@@@@@@@@@@@');
    console.log(req.body);
    console.log(errorMessages);

    if (errorMessages.length === 0) {
        Book.update(req.body, { where: [{ id: req.params.id }] }).then((newBook) => {
            res.redirect('/books');
        })
    }
});

// else {
//     res.render('book_detail', {
//         errorMessages: errorMessages,
//         title: title,
//         author: author,
//         genre: genre,
//         firstPublished: firstPublished
//     });
// }

module.exports = router;