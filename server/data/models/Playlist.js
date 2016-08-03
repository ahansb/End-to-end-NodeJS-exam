var mongoose = require('mongoose');

var requiredMessage = '{PATH} is required';

var defaultRating = 0;

module.exports.init = function () {
    var playlistSchema = mongoose.Schema({
        title: {type: String, required: requiredMessage},
        description: {type: String, required: requiredMessage},
        videoUrls: [String],
        category: {type: String, required: requiredMessage},
        creator: {type: String, required: requiredMessage},
        creationDate: {type: Date, required: requiredMessage},
        isPrivate: Boolean,
        visibleTo:[String],
        comments: [{
            username: String,
            content: String
        }],
        rating: {type: Number, default: defaultRating}
    });

    var Playlist = mongoose.model('Playlist', playlistSchema);

    //Adding playlists in DB

    Playlist.find({}).exec(function (err, collection) {
        if (err) {
            console.log('Cannot find users: ' + err);
            return;
        }
        if (collection.length === 0) {


            Playlist.create({
                title: 'Chalga',
                description: 'TurboFolk',
                videoUrls: ['https://www.youtube.com/watch?v=teA8TE092ss', 'https://www.youtube.com/watch?v=ZEHHJZB3mK4'],
                category: 'Pop-folk',
                creator: 'ivaylo.kenov',
                creationDate: new Date(),
                isPrivate: false
            });
            Playlist.create({
                title: 'Trans',
                description: 'TupsaTupsa',
                videoUrls: ['https://www.youtube.com/watch?v=LCVuIsw78yA', 'https://www.youtube.com/watch?v=m9P2uKNT4rw'],
                category: 'Techno',
                creator: 'Nikolay.IT',
                creationDate: new Date(),
                isPrivate: false
            });
            Playlist.create({
                title: 'Taina',
                description: 'HopTrop',
                videoUrls: ['https://www.youtube.com/watch?v=KZaz7OqyTHQ', 'https://www.youtube.com/watch?v=rog8ou-ZepE'],
                category: 'HipHop',
                creator: 'Nikolay.IT',
                creationDate: new Date(),
                isPrivate: false
            });
            console.log('Playlists added to database...');
        }
    });
};



