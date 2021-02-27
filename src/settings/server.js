const morgan = require("morgan"),
    express = require("express"),
    passport = require('passport');

require('dotenv').config();
require('./database');
require('../middlewares/passport');

module.exports = (app) => {
    
    // Settings
    app.set("port", process.env.PORT);

    // Middlewares
    app.use(morgan('dev'));
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());
    app.use(passport.initialize());

    // Routes
    app.use('/api/auth', require('../routes/auth-route'));

    return app;
}