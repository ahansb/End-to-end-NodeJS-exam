var mongoose = require('mongoose'),
    encryption = require('../../utilities/encryption');

var requiredMessage = '{PATH} is required';
var defaultAvatar = 'http://www.metalinjection.net/wp-content/uploads/2012/02/Facebook_Batman-avatar-211x300.jpg';
var defaultRating = 0;

module.exports.init = function () {
    var userSchema = mongoose.Schema({
        username: {type: String, require: requiredMessage, unique: true},
        firstName: {type: String, require: requiredMessage},
        lastName: {type: String, require: requiredMessage},
        email: {type: String, required: requiredMessage},
        avatar: {type: String, default: defaultAvatar},
        facebook: String,
        youtube: String,
        rating: {type: Number, default: defaultRating},
        salt: String,
        hashPass: String
    });

    userSchema.method({
        authenticate: function (password) {
            if (encryption.generateHashedPassword(this.salt, password) === this.hashPass) {
                return true;
            }
            else {
                return false;
            }
        }
    });

    var User = mongoose.model('User', userSchema);

    User.find({}).exec(function (err, collection) {
        if (err) {
            console.log('Cannot find users: ' + err);
            return;
        }
//Adding Users in DB
        if (collection.length === 0) {
            var salt;
            var hashedPwd;

            salt = encryption.generateSalt();
            hashedPwd = encryption.generateHashedPassword(salt, 'Ivaylo');
            User.create({
                username: 'ivaylo.kenov',
                firstName: 'Ivaylo',
                lastName: 'Kenov',
                salt: salt,
                hashPass: hashedPwd,
                roles: ['admin'],
                email: 'ivo@kenov.com',
                facebook: 'https://www.facebook.com/ivaylo.kenov?fref=ts',
                youtube: 'https://www.facebook.com/ivaylo.kenov?fref=ts',
                rating: 0
            });
            salt = encryption.generateSalt();
            hashedPwd = encryption.generateHashedPassword(salt, 'Nikolay');
            User.create({
                username: 'Nikolay.IT',
                firstName: 'Nikolay',
                lastName: 'Kostov',
                salt: salt,
                hashPass: hashedPwd,
                roles: ['standard'],
                email: 'mikolay@it.com',
                facebook: 'https://www.facebook.com/Nikolay.IT?fref=ts',
                youtube: 'https://www.facebook.com/Nikolay.IT?fref=ts',
                rating: 0
            });
            salt = encryption.generateSalt();
            hashedPwd = encryption.generateHashedPassword(salt, 'Doncho');
            User.create({
                username: 'Doncho',
                firstName: 'Doncho',
                lastName: 'Minkov',
                salt: salt,
                hashPass: hashedPwd,
                email: 'doncho@minkov.com',
                facebook: 'https://www.facebook.com/DonchoMinkov?fref=ts',
                youtube: 'https://www.facebook.com/DonchoMinkov?fref=ts',
                rating: 0
            });
            console.log('Users added to database...');
        }
    });

};


