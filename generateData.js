const faker = require('faker'),

log = require('./lib/log')(module),
db = require('./lib/mongoose'),
config = require('./lib/config.json'),
passHash = require('password-hash'),
User = require('./src/models/user/model'),
Book = require('./src/models/book/model');

User.remove({}, (err) => {

    let passwordHash1 = passHash.generate(config.default.user1.password);
    let passwordHash2 = passHash.generate(config.default.user2.password);
    let passwordHash3 = passHash.generate(config.default.user3.password);
    let passwordHash4 = passHash.generate(config.default.user4.password);
    let passwordHash = passHash.generate(config.default.admin.password);

    let users = [];

    let admin = new User({
        login: config.default.admin.login,
        passwordHash: passwordHash,
        email: config.default.admin.email,
        phone: config.default.admin.phone,
        role: config.default.admin.role,
        name:  config.default.admin.name,
        books:  [config.default.book4.name]
    });

    let user1 = new User({
        login: config.default.user1.login,
        passwordHash: passwordHash1,
        email: config.default.user1.email,
        phone: config.default.user1.phone,
        name:  config.default.user1.name,
        books: [config.default.book2.name, config.default.book1.name]

    });

    let user2 = new User({
        login: config.default.user2.login,
        passwordHash: passwordHash2,
        email: config.default.user2.email,
        phone: config.default.user2.phone,
        name:  config.default.user2.name,
    });

    let user3 = new User({
        login: config.default.user3.login,
        passwordHash: passwordHash3,
        email: config.default.user3.email,
        phone: config.default.user3.phone,
        name:  config.default.user3.name,
        books:  [config.default.book5.name]
    });

    let user4 = new User({
        login: config.default.user4.login,
        passwordHash: passwordHash4,
        email: config.default.user4.email,
        phone: config.default.user4.phone,
        name:  config.default.user4.name,
    });

    users.push(admin);
    users.push(user1);
    users.push(user2);
    users.push(user3);
    users.push(user4);

    for(let user of users){
        user.save((err, user) => {
            if(!err) {
                log.info(JSON.stringify({
                    "New User":{
                        "email": user.email,
                        "login": user.login,
                        "passwordHash": user.passwordHash
                    }
                }));
            }else {
                return log.error(err);
            }
        });
    }
});

Book.remove({}, (err) => {

    let books = [];

    let book1 = new Book({
        author: config.default.book1.author,
        name: config.default.book1.name,
        userName: config.default.user1.name
    });

    let book2 = new Book({
        author: config.default.book2.author,
        name: config.default.book2.name,
        userName: config.default.user1.name
    });

    let book3 = new Book({
        author: config.default.book3.author,
        name: config.default.book3.name
    });

    let book4 = new Book({
        author: config.default.book4.author,
        name: config.default.book4.name,
        userName: config.default.admin.name
    });

    let book5 = new Book({
        author: config.default.book5.author,
        name: config.default.book5.name,
        userName: config.default.user3.name
    });


    books.push(book1);
    books.push(book2);
    books.push(book3);
    books.push(book4);
    books.push(book5);

    for(let book of books){
        book.save((err, book) => {
            if(!err) {
                log.info(JSON.stringify({
                    "New Book":{
                        "author": book.author,
                        "name": book.name
                    }
                }));
            }else {
                return log.error(err);
            }
        });
    }
});


setTimeout(function() {
    db.disconnect();
}, 3000);