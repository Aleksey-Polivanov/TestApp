'use strict';

const express = require('express'),
    validator = require('validator'),
    log = require('./../../../lib/log'),
    AuthorizationService = require('./service'),
    User = require('./../user/model'),
    passHash = require('password-hash'),
    router = express.Router();

router.post('/signIn',  (req, res) => {
    AuthorizationService.authenticate(req.body.login, req.body.password)
        .then((user) => AuthorizationService.generateToken(user))
        .then((token) => {
            if (!token.token) {
                res.json({type: 'Error', message: 'Missing fields in authentication results.'});
            } else {
                res.cookie('access_token', token.token, {expires: new Date(Date.now() + 600000)});
                res.redirect('/api/adminConsole');
            }
        })
        .catch(err => {
            res.json({type: 'Error',
                err: err, message: 'Authentication Failure'});
        })
});

router.post('/singUp', (req, res) => {

    if(req.body.password === undefined){
        res.json({
            type: 'Error',
            message: 'invalid password'
        })
    }

    let passwordHash = passHash.generate(req.body.password);
    let email ;
    let phone ;

    const regexEmail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
    const regexPhone = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;

    if(regexEmail.test(req.body.login)){
        email = req.body.login
    }

    if(regexPhone.test(req.body.login)) {
        phone = req.body.login
    }

    if(phone === undefined && email === undefined){
        res.json({
            type: 'Error',
            message: 'invalid logIn'
        })
    }

    let user = new User({
        login: req.body.login,
        passwordHash: passwordHash,
        email: email,
        phone: phone,
        name:  req.body.name,
    });

    user.save((err) =>{
        if(err) {
            console.log(err);
            res.statusCode = 500;
            res.redirect('/#RegUser')
        } else {
            console.log('User was created');
            res.statusCode = 200;
            res.redirect('/first')
        }
    })
});

router.post('/logout', (req, res) => {

    req.cookies.access_token = '';
    res.redirect('/')
});




module.exports = router;