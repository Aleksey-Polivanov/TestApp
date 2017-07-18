'use strict';

const log = require('../../../lib/log')(module),
      _ = require('lodash'),
      config = require('../../../lib/config.json'),
      jwt = require('jsonwebtoken'),
      validator = require('validator'),
      User = require('./../user/model'),
      Book = require('./../book/model'),
      passwordHash = require('password-hash');


const UserService = {

    changeBook: (bookID, user) => {
        return new Promise((resolve, reject) => {
            if (_.isEmpty(bookID)) {
                return reject(log.error("Error"));
            }
            else {

                let bookTake;

                Book.findById(bookID, (err, book) => {
                    if (!book) {
                        return reject(log.error(err));
                    } else {
                        if (book.userName !== "empty") {
                            return reject(log.error(err));
                        } else {
                            bookTake = book;

                            let bookUpdateData = {
                                userID: user._id,
                                userName: user.name
                            };

                            book.update(bookUpdateData, (err) => {
                                if (err) {
                                    console.log(err);
                                    return reject(log.error(err));
                                } else {
                                    return resolve(bookTake, user);
                                }
                            })
                        }
                    }
                })
            }
        })
    },

    changeUser: (book, user) => {
        return new Promise((resolve, reject) => {
            if (_.isEmpty(book)) {
                return reject(log.error("Error"));
            }
            else {

                User.findById(user._id, (err, user) => {

                    if (!user) {
                        return reject(log.error(err));
                    } else {

                        let userBook = book;
                        let books = user.books;
                        books.push(userBook);

                        let userUpdateData = {
                            books: books
                        };

                        user.update(userUpdateData, (err) => {
                            if (err) {
                                return reject(log.error(err));
                            } else {
                                return resolve();
                            }
                        })
                    }
                })
            }
        })
    }
};
module.exports = UserService;