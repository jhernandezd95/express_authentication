const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
userModel.pre('save', async (next) => {
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;
  next();
});

// Check if passwords matches
userModel.methods.isValidPassword = async (password) => {
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
