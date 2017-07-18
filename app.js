const express = require('express'),
      path = require('path'),
      http = require('http'),
      favicon = require('serve-favicon'),
      config = require('./lib/config.json'),
      logger = require('morgan'),
      jwt = require('jsonwebtoken'),

      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      log = require('./lib/log')(module),
      ejs = require('ejs'),

    User = require('./src/models/user/model'),
    Book = require('./src/models/book/model'),

    AuthorizationService = require('./src/models/Authorization/service'),

    mongoose = require('mongoose'),

    authRoutes = require('./src/models/Authorization/authRoute'),
    restRoutes = require('./src/rest-routes');

const app = express();

app.set('port', process.env.PORT || config.port);

const server = app.listen(app.get('port'), () => {
    log.info('Express server listening on port ' + app.get('port'));
});

let usersList = [];
let booksList = [];

User.find((err, users) => {
    if (!err) {
        usersList = users;
        return usersList;
    } else {
        log.error(err.message);
        return log.info({error: 'Server error'});
    }
});

Book.find((err, books) => {
    if (!err) {
        booksList = books;
        return booksList;
    } else {
        log.error(err.message);
        return log.info({error: 'Server error'});
    }
});

app.set('views', __dirname + '/assets/templates');
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/assets/public/favicon.ico')); // отдаем свою фавиконку
app.use(logger('dev')); // выводим все запросы со статусами в консоль

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/assets/public')));

app.use(authRoutes);

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/first', (req, res) => {
    User.find((err, users) => {
        if (!err) {
            usersList = users;
            res.redirect('/#LoginUser');
        } else {
            log.error(err.message);
            return log.info({error: 'Server error'});
        }
    });
});

// route middleware to verify and refresh a token
app.use(function(req, res, next) {

    let token = req.body.token || req.cookies.access_token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, "SuperPuperMegaSecretKey", function (err, decoded) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                User.findOne({
                    login: decoded.login
                }, (err, user) => {
                    if (err) {
                        return res.json({success: false, status: 500, message: 'Server Error'})
                    }
                    if (!user) {
                        return res.json({success: false, status: 404, message: 'User Not Found'})
                    } else {
                        AuthorizationService.refreshTokenFor(user)
                            .then((token) => {
                                if (!token.token) {
                                    return res.json({
                                        success: false,
                                        status: 402,
                                        message: 'Missing fields in authentication results'
                                    })
                                } else {
                                    res.cookie('access_token', token.token, {expires: new Date(Date.now() + 600000)});;
                                    req.auth = {
                                        user: user,
                                    };
                                    next()
                                }
                            })
                    }
                })
            }
        })
    }
});

app.get('/api/adminConsole', (req, res) => {
    res.render('adminConsole', {
        users: usersList,
        books: booksList
    })
});

app.get('/updU', (req, res) => {
    User.find((err, users) => {
        if (!err) {
            usersList = users;
            res.redirect('/updB');
        } else {
            log.error(err.message);
            return log.info({error: 'Server error'});
        }
    });
});

app.get('/updB', (req, res) => {
    User.find((err, users) => {
        if (!err) {
            usersList = users;
            res.redirect('/api/adminConsole');
        } else {
            log.error(err.message);
            return log.info({error: 'Server error'});
        }
    });
});


app.get('/updateUser', (req, res) => {
    User.find((err, users) => {
        if (!err) {
            usersList = users;
            res.redirect('/api/adminConsole');
        } else {
            log.error(err.message);
            return log.info({error: 'Server error'});
        }
    });
});

app.get('/updateBook', (req, res) => {
    Book.find((err, books) => {
        if (!err) {
            booksList = books;
            res.redirect('/api/adminConsole');
        } else {
            log.error(err.message);
            return log.info({error: 'Server error'});
        }
    });


});

app.get('/updateBooks', (req, res) => {
    booksList = [];
    res.redirect('/api/adminConsole')
});

app.get('/updateUsers', (req, res) => {
    usersList = [];
    res.redirect('/api/adminConsole')
});

app.get('/test', (req, res) => {
    console.log ("Test")
});


app.use(restRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    res.status(404);
    log.debug('%s %d %s', req.method, res.statusCode, req.url);
    res.json({
        error: 'Not found'
    });
});

// error handlers
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    log.error('%s %d %s', req.method, res.statusCode, err.message);
    res.json({
        error: err.message
    });
});

module.exports = app;