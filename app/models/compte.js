const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

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
const emailValidators = [{
  validator: validEmailChecker,
  message: 'Email invalide'
}];

// User schema
// TODO: Ajouter adresse (autocompletion sur l'adresse en fonction de la position GPS de l'utilisateur ?)
const compteSchema = new Schema({
  nom: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100
  },
  prenom: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: emailValidators,
    minlength: 6,
    maxlength: 100
  },
  numTel: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 40
  },
  adresse: {
    rue: {
      type: String,
      required: true,
    },
    complementAdresse: {
      type: String
    },
    cp: {
      type: String,
      required: true
    },
    ville: {
      type: String,
      required: true
    }
  }
});

module.exports = mongoose.model('Compte', compteSchema);