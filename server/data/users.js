var User = require('mongoose').model('User');

module.exports = {
    create: function (user, callback) {
        User.create(user, callback);
    },
    update: function (user,newData, callback) {
        console.log(user);
console.log(newData);
       User.update({_id:user._id},{$set: newData},{upsert: true},callback);
    }
};
