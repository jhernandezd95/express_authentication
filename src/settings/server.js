const morgan = require("morgan"),
    express = require("express"),
    passport = require('passport'),
    {requestLoggin, errorLoggin} = require('../middlewares/winston');

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

    app.use(requestLoggin);

    // Routes
    app.use('/api/auth', require('../routes/auth-route'));

    app.use(errorLoggin);

    return app;
}