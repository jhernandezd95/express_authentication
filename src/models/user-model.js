const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userModel = new Schema({
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
        maxlength: 20
    },
    isActive: {
        type: Boolean,
        default: false
    },
    dateJoined: {
        type: Date,
        default: Date.now
    },
    resetToken: {
        type: String
    }
},{ timestamps: true });

// Hash password
userModel.pre(
    'save',
    async function(next) {
      const user = this;
      const hash = await bcrypt.hash(this.password, 10);
  
      this.password = hash;
      next();
    }
);

// Check if passwords matches
userModel.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
  
    return compare;
}

// Validate email address
userModel
  .path('email')
  .validate(function (value) {

    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(String(value).toLowerCase);

}, 'Email is invalid');

module.exports = mongoose.model('user', userModel);