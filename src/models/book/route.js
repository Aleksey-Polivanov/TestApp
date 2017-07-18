'use strict';

const express = require('express'),
    validator = require('validator'),
    log = require('./../../../lib/log'),
    passHash = require('password-hash'),
    db = require('./../../../lib/mongoose'),
    Book = require('./model'),
    router = express.Router();

router.get('/books', (req, res) => {

    return Book.find((err, books) => {
        if(!err){
            res.statusCode = 200;
            return res.send(books);
        } else {
            res.statusCode = 500;
            log.error(err.message);
            return res.send({ error: 'Server error'});
        }
    })
});

router.post('/book', (req, res) => {

    let book = new Book({
        author: req.body.author,
        name: req.body.name,
    });

    book.save((err) =>{
        if(err) {
            console.log(err);
            res.statusCode = 500;
            res.send('Book was not created')
        } else {
            console.log('Book was created');
            res.statusCode = 200;
            res.redirect('/updateBook');
        }
    })
});

router.get('/book/:id', (req, res) => {
    return Book.findById(req.params.id, function (err, book) {
        if(!book) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        if (!err) {
            res.statusCode = 200;
            return res.send({ status: 'Book was Created', book: book });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

router.post('/updateBook', (req, res) => {
    return Book.findById(req.query.id, (err, book) => {

        if(!book) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        let updateData = {
            author:  req.body.author,
            name: req.body.name,
        };

        return book.update(updateData, (err) => {
            if(err) {
                console.log(err);
                res.statusCode = 500;
                res.send('Server Error')
            } else {
                console.log('Book updated');
                res.statusCode = 200;
                res.redirect('/updateBook');
            }
        });
    });
});

router.post('/delBook', (req, res) => {
    return Book.findById(req.query.id, (err, book) => {
        if(!book) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return book.remove((err) => {
            if (!err) {
                res.statusCode = 200;
                console.log("book removed");
               res.redirect('/updateBook');
            } else {
                res.statusCode = 500;
                return res.send({ error: 'Server error' });
            }
        });
    });
});

router.post('/delBooks', (req, res) => {
    return Book.find((err, books) => {
        if (err) {
            res.statusCode = 500;
            log.error(err.message);
            return res.send({error: 'Server error'});
        } else {
            for( let book of books){
                book.remove((err) => {
                    if (!err) {
                        console.log("book removed");
                    } else {
                        res.statusCode = 500;
                        return res.send({error: 'Server error'});
                    }
                })
            }
            res.statusCode = 200;
            console.log("users removed");
            res.redirect('/updateBooks');
        }
    });
});

module.exports = router;