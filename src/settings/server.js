const morgan = require("morgan"),
    express = require("express"),
    passport = require('passport');

require('./database');

module.exports = (app) => {
    
    // Settings
    app.set("port", 3000);

    // Middlewares
    app.use(morgan('dev'));
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());

    return app;
}