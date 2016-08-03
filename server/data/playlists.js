var Playlist = require('mongoose').model('Playlist'),
    constants = require('../common/constants');

var cache = {
    expires: undefined,
    data: undefined,
    cachePage: 1
};
var minutesForCaching = 0;

module.exports = {
    create: function (playlist, user, callback) {
        if (constants.categories.indexOf(playlist.category) < 0) {
            callback('Invalid category!');
            return;
        }

        playlist.creator = user.username;
        playlist.phoneNumber = user.phoneNumber;
        var date = new Date(playlist.date);
        playlist.date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
        //playlist.date.setMonth(10);

        if (playlist.latitude && playlist.longitude) {
            playlist.location = {
                latitude: playlist.latitude,
                longitude: playlist.longitude
            }
        }

        Playlist.create(playlist, callback);
    },
    public: function (isPrivate, callback) {
        page = 1;
        pageSize = 8;

        if (cache.expires && cache.expires > new Date() && cache.data && cache.cachePage == page) {
            //console.log(cache.data);
            // console.log(cache.cachePage +'Cache page');

            callback(null, cache.data);
            // console.log(cache.data);
            console.log('i have used cache');
            // return;
        }
        else {
            Playlist.find({isPrivate: isPrivate})
                .sort({
                    rating: 'desc'
                })
                .limit(+pageSize)
                .skip((page - 1) * pageSize)
                .exec(function (err, foundPlaylists) {
                    if (err) {
                        // console.log("Fist Err" +err);
                        callback(err);
                        return;
                    }

                    Playlist.count().exec(function (err, numberOfPlaylists) {
                        if (err) {
                            console.log('MF Error' + err);
                        }
                        // console.log('HEYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY');
                        var data = {
                            playlists: foundPlaylists,
                            currentPage: page,
                            pageSize: pageSize,
                            total: numberOfPlaylists
                        };
                        console.log("not cached Data");

                        callback(err, data);

                        cache.data = data;
                        cache.cachePage = page;

                        //console.log(cache.data);
                        //console.log("Cached data");
                        // console.log(data);
                        cache.expires = new Date();
                        cache.expires.setMinutes(cache.expires.getMinutes() + minutesForCaching);// 10 min
                        console.log('CACHEEEE EXPIRES ON');
                        console.log(cache.expires);
                    });
                })
        }
    },

    visible: function (page, pageSize, isPrivate, user,sortBy, callback) {
        page = page || 1;
        pageSize = +pageSize || 10;
console.log({sortBy:'desc'});
        var sort = {};
        if(sortBy == 'creationDate'){
            sort = {creationDate:'desc'};
        }
        if(sortBy == 'rating'){
            sort = {rating:'desc'};
        }

        Playlist.find({
                $or: [{creator: user.username}, {isPrivate: isPrivate}, {visibleTo: user.username}]
            })
            .sort(sort)
            .limit(+pageSize)
            .skip((page - 1) * pageSize)
            .exec(function (err, foundPlaylists) {
                if (err) {
                    callback(err);
                    return;
                }

                Playlist.count().exec(function (err, numberOfPlaylists) {

                    var data = {
                        playlists: foundPlaylists,
                        currentPage: page,
                        pageSize: pageSize,
                        total: numberOfPlaylists
                    };

                    callback(err, data);
                });
            });

    },
    mine:function ( user, callback) {


        Playlist.find({
                $or: [{creator: user.username}]
            })
            .sort({
                creationDate: 'desc'
            })
            .exec(function (err, foundPlaylists) {
                if (err) {
                    callback(err);
                    return;
                }

                Playlist.count().exec(function (err, numberOfPlaylists) {

                    var data = {
                        playlists: foundPlaylists,
                        currentPage: page,
                        pageSize: pageSize,
                        total: numberOfPlaylists
                    };

                    callback(err, data);
                });
            });

    },
    details:function ( id, callback) {
console.log(id);

        Playlist.find({
                $or: [{_id: id}]
            })
            .exec(function (err, foundPlaylists) {
                if (err) {
                    callback(err);
                    return;
                }

                Playlist.count().exec(function (err, numberOfPlaylists) {

                    var data = {
                        playlists: foundPlaylists,
                        currentPage: page,
                        pageSize: pageSize,
                        total: numberOfPlaylists
                    };

                    callback(err, data);
                });
            });

    },
    addDetails:function ( id,newData,user, callback) {
        console.log(id);

        Playlist.findOne({_id: id}, function(err, playlist) {
            if(!err) {
                if(newData.videoUrls){
                    playlist.videoUrls.push(newData.videoUrls);
                }
                if(newData.comments){
                    playlist.comments.push({username:user,content:newData.comments});
                }
                if(newData.visibleTo){
                    playlist.visibleTo.push(newData.visibleTo);
                }

                playlist.save(callback);
            }
        });

    }
};