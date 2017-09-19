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
    res.render('new_patron');
});

// GET all patrons
router.get('/', (req, res, next) => {
    Patron.findAll({
        order: [["last_name"]]
    }).then((patrons) => {
        res.render('all_patrons', {
            patrons: patrons,
            title: 'Patrons'
        });
    });
});

// GET patron detail page
router.get('/:id', (req, res, next) => {
    const getPatron = Patron.findOne({
        where: [
            { id: req.params.id }
        ]
    })

    const getLoans = Loan.findAll({
        where: [
            { patron_id: req.params.id }
        ],
        include: [{
            model: Patron
        },
        {
            model: Book
        }],
    });

    Promise.all([getPatron, getLoans]).then(results => {
        res.render('patron_detail', {
            patron: results[0],
            loans: results[1]
        });
    });
});

// UPDATE a patron detail page
router.post('/:id/update', (req, res, next) => {
    const getPatron = Patron.findOne({
        where: [
            { id: req.params.id }
        ]
    });

    const getLoans = Loan.findAll({
        where: [
            { patron_id: req.params.id }
        ],
        include: [{
            model: Patron
        },
        {
            model: Book
        }]
    });

    Promise.all([getPatron, getLoans]).then(results => {
        Patron.update(req.body, { where: [{ id: req.params.id }] }).then((newPatron) => {
            res.redirect('/patrons');
        }).catch(err => {
            if (err.name) {
                res.render('patron_detail', {
                    patron: results[0],
                    loans: results[1],
                    errors: err.errors
                });
            } else {
                res.status(500).send(err);
            }
        })
    });
});

// POST a patron to the database
router.post('/new', (req, res, next) => {
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const address = req.body.address;
    const email = req.body.email;
    const libraryId = req.body.library_id;
    const zipCode = req.body.zip_code;

    Patron.create(req.body).then((newPatron) => {
        res.redirect('/patrons');
    }).catch(err => {
        if (err.name) {
            res.render('new_patron', {
                firstName: firstName,
                lastName: lastName,
                address: address,
                email: email,
                libraryId: libraryId,
                zipCode: zipCode,
                errors: err.errors
            });
        } else {
            res.status(500).send(err);
        }
    })
});

module.exports = router;