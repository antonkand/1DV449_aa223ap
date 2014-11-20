var checked = require('../checked');
var config = {};
config.db = {
    connectionString: 'mongodb://localhost:27017',
    set: function (dbstring) {
        // if passed in dbstring is string,
        // set db, otherwise fallback to localhost
        config.db.connectionString = checked.isString(dbstring) ? dbstring : config.db.connectionString;
        },
    get: function () {
        console.log(config.db.connectionString);
    }
};

config.session = {
    secret: 'i like pickles',
    set: function (supersecretString) {
        // if passed in supersecretString is string,
        config.session.secret = checked.isString(supersecretString) ? supersecretString : config.session.secret;
    },
    get: function () {
        return config.session.secret;
    }
};

config.routing = {
    loggedOutRoute: '/login',
    loggedInRoute: '/logged-in',
    setLogIn: function (route) {
        config.routing.loggedOutRoute = checked.isString(route) ? route : config.routing.loggedOutRoute;
    },
    getLoggedOut: function () {
        return config.routing.loggedOutRoute;
    },
    setLoggedIn: function (route) {
        config.routing.loggedInRoute = checked.isString(route) ? route : config.routing.loggedInRoute;
    },
    getLoggedIn: function () {
        return config.routing.loggedInRoute;
    }
};

config.views = {
    folder: '/views',
    loggedOut: 'social-media-login',
    loggedIn: '/logged-in',
    setLoggedOut: function (view) {
        config.views.loggedOut = checked.isString(view) ? view : config.views.loggedOut;
    },
    getLoggedOut: function () {
        return config.views.loggedOut;
    },
    setLoggedIn: function (view) {
        config.views.loggedIn = checked.isString(view) ? view : config.views.loggedIn;
    },
    getLoggedIn: function () {
        return config.views.loggedIn;
    },
    setFolder: function (folder) {
        config.views.folder = checked.isString(folder) ? folder : config.views.folder;
    },
    getFolder: function () {
        return config.views.folder;
    }
};
module.exports = config;