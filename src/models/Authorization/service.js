'use strict';

const log = require('../../../lib/log')(module),
      _ = require('lodash'),
      config = require('../../../lib/config.json'),
      jwt = require('jsonwebtoken'),
      validator = require('validator'),
      User = require('./../user/model'),
      passwordHash = require('password-hash');


const AuthorizationService = {

    authenticate: (login, password)=> {
        return new Promise((resolve, reject) => {
            if (_.isEmpty(login)) {
                return reject(log.error("login can not be empty"));
            }
            if (_.isEmpty(password)) {
                return reject(log.error("Password can not be empty"));
            } else {
                User.findOne({
                    login: login
                }, (err, user) => {
                    if (err) {
                        return reject(log.error(err));
                    }
                    if (!user) {
                        return reject(log.error("User not found"));
                    } else {
                        if (!passwordHash.verify(password, user.passwordHash)) {
                            return reject(log.error("wrong password"));
                        } else {
                            return resolve(user);
                        }
                    }
                })
            }
        })
    },

    generateToken: (user) => {
        if (_.isEmpty(user)) {
            return Promise.reject(log.error("User can not be empty"));
        }
        return Promise.resolve({
            token: jwt.sign({
                    login: user.login,
                    password: user.passwordHash,
                },
                "SuperPuperMegaSecretKey",
                {
                    expiresIn: config.security.tokenLife
                }
            ),
            expiresIn: config.security.tokenLife,
            // domain: `${config.publicServerName}.${config.domainName}`,
            // userId: user.id
        })
            .catch(error => {
                log.error(error);
                throw  error;
            });
    },

    refreshTokenFor: (user) => {
        return new Promise((resolve,reject)=>{
            if (_.isEmpty(user)) {
                return reject(log.error("User can not be empty"));
            }
            return resolve(AuthorizationService.generateToken(user))
                .catch(error => {
                    log.error(error);
                    throw  error;
                })
        })
    }
};

module.exports = AuthorizationService;