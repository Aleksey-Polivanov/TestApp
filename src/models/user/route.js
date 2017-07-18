'use strict';

const express = require('express'),
    validator = require('validator'),
    log = require('./../../../lib/log'),
    User = require('./model'),
    UserService = require('./service'),
    router = express.Router();

router.get('/users', (req, res) => {

    return User.find((err, users) => {
        if(!err){
            res.statusCode = 200;
            return res.send(users);
        } else {
            res.statusCode = 500;
            log.error(err.message);
            return res.send({ error: 'Server error'});
        }
    })
});

router.get('/user/:id', (req, res) => {
    return User.findById(req.params.id, function (err, user) {
        if(!user) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        if (!err) {
            res.statusCode = 200;
            return res.send({ status: 'User was Created', user: user });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

router.post('/updateUser', (req, res) => {

     User.findById(req.query.id, (err, user) => {

        if(!user) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        let updateData = {
            email: req.body.email,
            phone: req.body.phone,
            };

         return user.update(updateData, (err) => {
            if(err) {
                console.log(err);
                res.statusCode = 500;
                res.send('Server Error')
            } else {
                console.log('User updated');
                res.statusCode = 200;
                res.redirect('/updateUser');
            }
        });
    });
});

router.post('/takeBook', (req, res) => {

    UserService.changeBook(req.query.id, req.auth.user)
        .then((book, user) => UserService.changeUser(book, user))
        .then(res.redirect('/updU'))
});

router.post('/delUsers', (req, res) => {
    return User.find((err, users) => {
        if (err) {
            res.statusCode = 500;
            log.error(err.message);
            return res.send({error: 'Server error'});
        } else {
            for( let user of users){
                user.remove((err) => {
                    if (!err) {
                        console.log("user removed");
                    } else {
                        res.statusCode = 500;
                        return res.send({error: 'Server error'});
                    }
                })
            }
            res.statusCode = 200;
            console.log("users removed");
            res.redirect('/updateUsers');
        }
    });
});

router.get('/info' ,(req, response) => {

    if (validator.isEmail(req.auth.user.login)) {
        let a = {
            id: req.auth.user._id,
            token: req.cookies.access_token,
            type: 'email',
            login: req.auth.user.login
        };
        response.json(a);
    } else {
        let a = {
            id: req.auth.user._id,
            type: 'phone',
            login: req.auth.user.login,
        };
        response.json(a);
    }
});

module.exports = router;