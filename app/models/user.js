const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Validate Function to check e-mail length
let emailLengthChecker = (email) => {
  if (!email) {
    return false;
  } else {
    if (email.length < 5 || email.length > 30) {
      return false;
    } else {
      return true;
    }
  }
};

// Validate Function to check if valid e-mail format
let validEmailChecker = (email) => {
  if (!email) {
    return false;
  } else {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regExp.test(email);
  }
};

// Email Validators
const emailValidators = [
  {
    validator: emailLengthChecker,
    message: 'E-mail must be at least 5 characters but no more than 30'
  },
  {
    validator: validEmailChecker,
    message: 'Must be a valid e-mail'
  }
];

// Validate Function to check username length
let usernameLengthChecker = (username) => {
  if (!username) {
    return false;
  } else {
    if (username.length < 3 || username.length > 15) {
      return false;
    } else {
      return true;
    }
  }
};

// Validate Function to check if valid username format
let validUsername = (username) => {
  if (!username) {
    return false;
  } else {
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    return regExp.test(username);
  }
};

// name validators
const usernameValidators = [
  {
    validator: usernameLengthChecker,
    message: 'Username must be at least 3 characters but no more than 15'
  },
  {
    validator: validUsername,
    message: 'Username must not have any special characters'
  }
];

// Validate Function to check password length
let passwordLengthChecker = (password) => {
  if (!password) {
    return false;
  } else {
    if (password.length < 8 || password.length > 35) {
      return false;
    } else {
      return true;
    }
  }
};

// Validate Function to check if valid password format
let validPassword = (password) => {
  if (!password) {
    return false;
  } else {
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    return regExp.test(password);
  }
};

// Password validators
const passwordValidators = [
  {
    validator: passwordLengthChecker,
    message: 'Password must be at least 8 characters but no more than 35'
  },
  {
    validator: validPassword,
    message: 'Must have at least one uppercase, lowercase, special character, and number'
  }
];

// User schema
const userSchema = new Schema({
  nom: {
    type: String,
    required: true,
    validate: usernameValidators
  },
  prenom: {
    type: String,
    required: true,
    validate: usernameValidators
  },
  password: {
    type: String,
    required: true,
    validate: passwordValidators
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: emailValidators
  }
});

// Middleware to encrypt password
userSchema.pre('save', function (next) {
  if (!this.isModified('password'))
    return next();

  bcrypt.hash(this.password, null, null, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

// Compare password with encryted password in database
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);