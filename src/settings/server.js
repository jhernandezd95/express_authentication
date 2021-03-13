/* eslint-disable global-require */
const morgan = require("morgan");
const express = require("express");
const passport = require('passport');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const {requestLoggin, errorLoggin} = require('../middlewares/winston');
const {options} = require('./swagger-options');

require('dotenv').config();
require('./database');
require('../middlewares/passport');
  
const swaggerSpec = swaggerJsdoc(options);

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
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use('/api/auth', require('../routes/auth-route'));

    app.use(errorLoggin);

    return app;
}