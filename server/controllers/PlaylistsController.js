var playlists = require('../data/playlists'),
    constants = require('../common/constants');

var CONTROLLER_NAME = 'playlists';

module.exports = {
    getCreate: function (req, res) {
        res.render(CONTROLLER_NAME + '/create', {
            categories: constants.categories
        });
    },
    postCreate: function (req, res) {
        var playlist = req.body;
        var user = req.user;
        playlist.creator = user.username;
        playlist.creationDate = new Date(); //TODO:Check date

        playlists.create(
            playlist,
            {
                username: user.username,
                phoneNumber: user.phoneNumber
            },
            function (err, event) {
                if (err) {
                    var data = {
                        categories: constants.categories,
                        errorMessage: err
                    };
                    res.render(CONTROLLER_NAME + '/create', data);
                }
                else {
                    res.redirect('/playlists/mine/' + event._id);//TODO:REDIRECTION!
                }
            })
    },
    getTopPublic: function (req, res) {

        var isPrivate = false;


        playlists.public(isPrivate, function (err, data) {
            res.render('index', {
                data: data
            });
        });
    },
    getVisible: function (req, res) {
        var page = req.query.page;
        var pageSize = req.query.pageSize;
        var user = req.user;
        var isPrivate = false;
        console.log(req.query);
        var sortBy = req.query.sortBy || 'rating';
console.log(sortBy);

        // put in the array options for filtering

        playlists.visible(page, pageSize, isPrivate, user, sortBy, function (err, data) {
            res.render(CONTROLLER_NAME + '/visible', {
                data: data
            });
        });
    },
    getMine: function (req, res) {

        var user = req.user;

        playlists.mine(user, function (err, data) {
            res.render(CONTROLLER_NAME + '/mine', {
                data: data
            });
        });
    },
    getDetails: function (req, res) {

        var id = req.params.id;


        playlists.details(id, function (err, data) {
            res.render(CONTROLLER_NAME + '/details', {
                data: data
            });
        });
    },
    postDetails: function (req, res, next) {
        var id = req.params.id;
        var user = req.user.username;
        var newData = {};
        console.log('tuk');
        console.log(user);
        if (req.body.videoUrls) {
            newData.videoUrls = req.body.videoUrls;
        }
        if (req.body.visibleTo) {
            newData.visibleTo = req.body.visibleTo;
        }
        if (req.body.comments) {

            newData.comments = req.body.comments;

        }


        playlists.addDetails(id, newData, user, function (err, playlist) {
            if (err) {
                console.log('Failed to update playlist: ' + err);
                return;
            }
            res.redirect('/playlists/mine/' + id);

        });
    }

};