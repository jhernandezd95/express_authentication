const jwt = require('jsonwebtoken');
const passport = require('passport');
const UserModel = require('../models/user-model');

const sendEmail = require('../helpers/send-mail');

function signUp(req, res) {
  
  UserModel.create(req.body)
    .then((user) => {
      const token = jwt.sign(user, process.env.ACCOUNT_ACTIVATE_KEY, {expiresIn: '10m'});
  
      try{
        sendEmail.sendMail(user.email, token, 1);
      } catch(err){
        res.json(err);
      }

      res.status(200).json({
        message: 'Signup successful',
        user: req.user
      });
    })
    .catch((error) => {
      res.status(400).send(error)
    })
}

async function login(req, res, next) {
  passport.authenticate(
    'local',
    async (err, user, info) => {
      try {
        if (err || !user) {
          
          const code = info.message === 'Missing credentials'? 400 : info.code;
          return res.status(code).send(info);
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
        return next(error);
      }
    }
  )(req, res, next);
}

async function verifyEmail(req, res) {
  const token = req.body.token;
  try{
    const data = jwt.verify(token, process.env.ACCOUNT_ACTIVATE_KEY);
    try{
      const user = await UserModel.findOneAndUpdate(
        {_id: data.user._id}, 
        {isActive: true},
        {runValidators: 1, passRawResult: true, new:true});
        if(!user){
          res.status(404).json({error : "User not found"});
        } else {
          res.json({result : "Email is verified of user "+ user._id});
        }
    } catch(err){
      res.send(err);
    }

  } catch(err){
    res.send(err);
  }
}

async function resendEmail(req, res) {
  try{
    const user = await UserModel.findOne({email: req.body.email});
    if(!user){
      res.status(404).json({error : "User not found"});
    } else {
      const token = jwt.sign({ user: user }, process.env.ACCOUNT_ACTIVATE_KEY, {expiresIn: '10m'});

      try{
        sendEmail.sendMail(user.email, token, 1)
        res.status(200).json({message: "The email has been send successfully"})
      } catch(err){
        res.send(err);
      }

    }
  } catch (err){
    res.send(err);
  }
}

async function forgotPassword(req, res){
  try{
    const user = await UserModel.findOne({email: req.body.email});
    if(!user){
      res.status(404).json({error : "User not found"});
    } else {
      const token = jwt.sign({ user: user }, process.env.FORGOT_PASSWORD_KEY, {expiresIn: '10m'});

      try{
        sendEmail.sendMail(user.email, token, 2);
      } catch(err){
        res.send(err);
      }
  
      try{
        await user.updateOne({resetToken: token});
        res.status(200).json({message: 'The email has been send successfully'})
      } catch(err){
        res.send(err);
      }
    }
  } catch(err){
    res.send(err);
  }
}

async function resetPassword(req, res) {
  const {resetToken, newPassword} = req.body;
  if(resetToken){
    try{
      jwt.verify(resetToken, process.env.FORGOT_PASSWORD_KEY);
      try{
        const user = await UserModel.findOne({resetToken: resetToken});
        if(!user){
          res.status(401).json({error: "User with this token does not exist."});
        }

        user.password = newPassword;
        user.resetToken = undefined;
        try{
          await user.save();
          res.status(200).json({message: "The password has been changed successfully"});
        } catch(err){
          res.send(err);
        }
      } catch (err){
        res.send(err);
      }
    } catch (err){
      res.send(err);
    }
  } else{
    res.status(401).json({error: "Token param missing."});
  }
}

module.exports = {
    signUp,
    login,
    verifyEmail,
    resendEmail,
    forgotPassword,
    resetPassword
}