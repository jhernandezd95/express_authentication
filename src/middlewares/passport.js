const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  JWTstrategy = require('passport-jwt').Strategy,
  ExtractJWT = require('passport-jwt').ExtractJwt;
require('dotenv').config();

const UserModel = require('../models/user-model');

passport.use(
  'local',
  new LocalStrategy({ usernameField: 'email', passwordField: 'password'},
  (email, password, done) => {
    UserModel.findOne({ email: email }, function(err, user) {
      if (err) { return done(err); }
      
      if (!user || !user.isValidPassword(password)) { 
        return done(null, false, { code: 401, message: 'Incorrect email or password.' });
      }

      if(!user.isActive){
        return done(null, false, { code: 403, message: 'User not active' });
      }

      return done(null, user);
    });
  }
));

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_KEY,
      jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT')
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);