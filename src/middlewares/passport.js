const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
require('dotenv').config();

const UserModel = require('../models/user-model');

passport.use(
  'local',
  new LocalStrategy({ usernameField: 'email', passwordField: 'password'},
  (email, password, done) => {
    UserModel.findOne({ email }, (err, user) => {
      if (err) { return done(err); }
      
      if (!user || !user.comparePasswords(password)) { 
        return done(null, false, { name: 'UserNotFound' });
      }

      if(!user.isActive){
        return done(null, false, { name: 'NotActive' });
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