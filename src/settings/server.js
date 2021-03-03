const morgan = require("morgan"),
    express = require("express"),
    passport = require('passport'),
    swaggerJsdoc = require("swagger-jsdoc"),
    swaggerUi = require("swagger-ui-express"),
    {requestLoggin, errorLoggin} = require('../middlewares/winston'),
    {options} = require('./swagger-options');

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