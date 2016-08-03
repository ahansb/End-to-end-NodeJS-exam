var encryption = require('../utilities/encryption');
var users = require('../data/users');

var CONTROLLER_NAME = 'users';

module.exports = {
    getRegister: function (req, res, next) {
        res.render(CONTROLLER_NAME + '/register')
    },
    postRegister: function (req, res, next) {
        var newUserData = req.body;

        if (newUserData.password != newUserData.confirmPassword) {
            req.session.error = 'Passwords do not match!';
            res.redirect('/register');
        }
        else {
            newUserData.salt = encryption.generateSalt();
            newUserData.hashPass = encryption.generateHashedPassword(newUserData.salt, newUserData.password);
            users.create(newUserData, function (err, user) {
                if (err) {
                    console.log('Failed to register new user: ' + err);
                    return;
                }

                req.logIn(user, function (err) {
                    if (err) {
                        res.status(400);
                        return res.render('error', {reason: err.toString()}); // TODO:-fixed
                    }
                    else {
                        res.redirect('/');
                    }
                })
            });
        }
    },
    getLogin: function (req, res) {
        res.render(CONTROLLER_NAME + '/login');
    },
    getProfile: function (req, res, next) {
        var user = req.user;

        res.render(CONTROLLER_NAME + '/profile', {
            data: user
        })
    },
    putProfile: function (req, res, next) {
        var user = req.user;
        var newUserData = {};
        if (req.body.password) {
            newUserData.password = req.body.password;
        }
        if (req.body.confirmPassword) {
            newUserData.confirmPassword = req.body.confirmPassword;
        }
        if (req.body.firstName) {
            newUserData.firstName = req.body.firstName;
        }
        if (req.body.lastName) {
            newUserData.lastName = req.body.lastName;
        }
        if (req.body.email) {
            newUserData.email = req.body.email;
        }
        if (req.body.avatar) {
            newUserData.avatar = req.body.avatar;
        }


        console.log('put' + req + newUserData);
        if (newUserData.password) {
            if (newUserData.password != newUserData.confirmPassword) {
                req.session.error = 'Passwords do not match!';
                res.redirect('/profile');
            }
            else {
                newUserData.salt = encryption.generateSalt();
                newUserData.hashPass = encryption.generateHashedPassword(newUserData.salt, newUserData.password);

            }
        }

        users.update(user, newUserData, function (err, user) {
            if (err) {
                console.log('Failed to register new user: ' + err);
                return;
            }


            res.redirect('/profile');

        });
    }
};