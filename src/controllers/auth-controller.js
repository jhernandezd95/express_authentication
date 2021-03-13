const jwt = require('jsonwebtoken');
const passport = require('passport');
const UserModel = require('../models/user-model');

const sendEmail = require('../helpers/send-mail');
const handleError = require('../helpers/handle-error');

function signUp(req, res) {
  
  UserModel.create(req.body)
    .then((user) => {
      const token = jwt.sign({user}, process.env.ACCOUNT_ACTIVATE_KEY, {expiresIn: '10m'});
  
      try{
        sendEmail.sendMail(user.email, token, 1);
      } catch(err){
        const errorFormat = {
          code: 500,
          name: "NodeMailerError",
          message: 'Issue sending a mail.',
          requestId: ''
        };
        res.status(errorFormat.code).send(errorFormat);
      }

      res.status(200).send({message: 'Signup successful'});
    })
    .catch((error) => {
      const mongoError = handleError.mongoErrorCather(error)
      res.status(mongoError.code).send(mongoError)
    })
}

async function login(req, res, next) {
  passport.authenticate(
    'local',
    async (err, user, info) => {
      try {
        if (err || !user) {
          
          let errorFormat = {}
          switch(info.name){
            case 'NotActive':
              errorFormat = {
                code: 403,
                name: info.name,
                message: 'User not active',
                requestId: ''
              };
              break;
              case 'UserNotFound':
                errorFormat = {
                  code: 401,
                  name: info.name,
                  message: 'Incorrect email or password',
                  requestId: ''
                };
                break;
              default:
                errorFormat = {
                  code: 400,
                  name: 'MissingCredentials',
                  message: 'Email and password fields are required',
                  requestId: ''
                };
          }
          return res.status(errorFormat.code).send(errorFormat);
        }

        req.login(
          user,
          { session: false },
          async (error) => {
            if (error) return next(error);

            const body = { _id: user._id, email: user.email };
            const token = jwt.sign({ user: body }, process.env.JWT_KEY, {expiresIn: '30m'});

            return res.json({ user, token });
          }
        );
      } catch (error) {
        const mongoError = handleError.mongoErrorCather(error)
        return next(mongoError);
      }
    }
  )(req, res, next);
}

async function verifyToken(req, res) {
  try{
    const data = jwt.verify(req.body.token, process.env.ACCOUNT_ACTIVATE_KEY);
    try{
      const user = await UserModel.findOneAndUpdate(
        {_id: data.user._id}, 
        {isActive: true},
        {runValidators: 1, passRawResult: true, new:true});
        if(!user){
          const errorFormat = {
            code: 404,
            name: "UserNotFound",
            message: 'User with this token does not exist.',
            requestId: ''
          };
          res.status(errorFormat.code).send(errorFormat);
        } else {
          res.status(200).send({message : `Email is verified of user ${user._id}`});
        }
    } catch(error){
      const mongoError = handleError.mongoErrorCather(error);
      res.status(400).send(mongoError);
    }

  } catch(err){
    const errorFormat = {
      code: 401,
      name: err.name,
      message: err.message,
      expiredAt: err.expiredAt,
      date: err.date,
      requestId: ''
    };
    res.status(errorFormat.code).send(errorFormat);
  }
}

async function resendEmail(req, res) {
  try{
    const user = await UserModel.findOne({email: req.body.email});
    if(!user){
      const errorFormat = {
        code: 404,
        name: "UserNotFound",
        message: 'User not found with that email.',
        requestId: ''
      };
      res.status(errorFormat.code).send(errorFormat);
    } else {
      const token = jwt.sign({ user }, process.env.ACCOUNT_ACTIVATE_KEY, {expiresIn: '10m'});

      try{
        sendEmail.sendMail(user.email, token, 1)
        res.status(200).json({message: 'The email has been send successfully'})
      } catch(err){
        const errorFormat = {
          code: 500,
          name: "NodeMailerError",
          message: 'Issue sending a mail.',
          requestId: ''
        };
        res.status(errorFormat.code).send(errorFormat);
      }

    }
  } catch (error){
      const mongoError = handleError.mongoErrorCather(error);
      res.status(mongoError.code).send(mongoError);
  }
}

async function forgotPassword(req, res){
  try{
    const user = await UserModel.findOne({email: req.body.email});
    if(!user){
      const errorFormat = {
        code: 404,
        name: "UserNotFound",
        message: 'User not found with that email.',
        requestId: ''
      };
      res.status(errorFormat.code).send(errorFormat);
    } else {
      const token = jwt.sign({ user }, process.env.FORGOT_PASSWORD_KEY, {expiresIn: '10m'});

      try{
        sendEmail.sendMail(user.email, token, 2);
      } catch(err){
        const errorFormat = {
          code: 500,
          name: 'NodeMailerError',
          message: 'Issue sending a mail.',
          requestId: ''
        };
        res.status(errorFormat.code).send(errorFormat);
      }
  
      try{
        await user.updateOne({resetToken: token});
        res.status(200).json({message: 'The email has been send successfully'})
      } catch(error){
          const mongoError = handleError.mongoErrorCather(error);
          res.status(mongoError.code).send(mongoError);
      }
    }
  } catch(error){
      const mongoError = handleError.mongoErrorCather(error);
      res.status(mongoError.code).send(mongoError);
  }
}

async function resetPassword(req, res) {
  const {resetToken, newPassword} = req.body;
  try{
    jwt.verify(resetToken, process.env.FORGOT_PASSWORD_KEY);
    try{
      const user = await UserModel.findOne({resetToken});
      if(!user){
        const errorFormat = {
          code: 404,
          name: "UserNotFound",
          message: 'User with this token does not exist.',
          requestId: ''
        };
        res.status(errorFormat.code).send(errorFormat);
      }

      user.password = newPassword;
      user.resetToken = undefined;
      try{
        await user.save();
        res.status(200).json({message: "The password has been changed successfully"});
      } catch(error){
          const mongoError = handleError.mongoErrorCather(error);
          res.status(mongoError.code).send(mongoError);
      }
    } catch (error){
        const mongoError = handleError.mongoErrorCather(error);
        res.status(mongoError.code).send(mongoError);
    }
  } catch (err){
    const errorFormat = {
      code: 401,
      name: err.name,
      message: err.message,
      expiredAt: err.expiredAt,
      date: err.date,
      requestId: ''
    };
    res.status(errorFormat.code).send(errorFormat);
  }
}

module.exports = {
    signUp,
    login,
    verifyToken,
    resendEmail,
    forgotPassword,
    resetPassword
}