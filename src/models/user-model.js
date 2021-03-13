const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const { Schema } = mongoose;

const userModel = new Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 20,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    dateJoined: {
      type: Date,
      default: Date.now,
    },
    resetToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Hash password
userModel.pre('save', async function (next) {
    const user = this;

    // generate a salt
    bcrypt.genSalt(Number(process.env.SALT_WORK_FACTOR), (err, salt) => {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, (error, hash) => {
          if (error) return next(error);
          // override the cleartext password with the hashed one
          user.password = hash;
          next();
      });
  });
  }
);

// Check if passwords matches
userModel.methods.comparePasswords = async (password) => {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

// Validate email address
userModel.path('email').validate((value) => {
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return re.test(String(value).toLowerCase());
}, 'Email is invalid');

module.exports = mongoose.model('user', userModel);
