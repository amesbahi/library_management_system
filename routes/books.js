'use strict';

const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

// GET all books
router.get('/', (req, res, next) => {
    Book.findAll({
        attributes: ['title', 'author', 'genre', 'first_published']
    }).then((res) => {
        console.log(res);
    });
    // loop over books and show in view
    res.render('all_books');
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