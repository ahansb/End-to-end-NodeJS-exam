var auth = require('./auth'),
    controllers = require('../controllers');



module.exports = function (app) {
    app.get('/register', controllers.users.getRegister);
    app.post('/register', controllers.users.postRegister);

    app.get('/login', controllers.users.getLogin);
    app.post('/login', auth.login);
    app.get('/logout', auth.logout);

    app.get('/profile', auth.isAuthenticated, controllers.users.getProfile);
    app.post('/profile', auth.isAuthenticated, controllers.users.putProfile);


    app.get('/playlists/create', auth.isAuthenticated, controllers.playlists.getCreate);
    app.post('/playlists/create', auth.isAuthenticated, controllers.playlists.postCreate);

    app.get('/playlists/visibleToMe', controllers.playlists.getVisible);
    app.get('/playlists/mine', controllers.playlists.getMine);

    app.get('/playlists/mine/:id', controllers.playlists.getDetails);
    app.post('/playlists/mine/:id', controllers.playlists.postDetails);



    app.get('/error-loggin', function (req, res) {
        res.render('users/error-page');
    });

    app.get('/error-auth', function (req, res) {
        res.render('users/error-unauth');
    });

    app.get('/',controllers.playlists.getTopPublic);

    app.get('*', function (req, res) {
        res.render('not-found');
    });
};