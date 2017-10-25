var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = (passport) => {
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  /**
   * Login local Strategy authenticate
   */
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email'
  }, (email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
      if (err) return done(err);

      // le compte n'existe pas pour cet email
      if (!user) return done(null, false, {
        success: false,
        message: 'Le Compte n\'existe pas'
      });

      // Password do not match
      if (!user.comparePassword(password))
        return done(null, false, {
          success: false,
          message: 'Email ou mot de passe invalide'
        });

      if (!user.validAccount) return done(null, false, {
        success: false,
        message: 'Le compte n\'est pas activé, Vérifier votre boîte mail'
      });

      // Authentication réussie
      return done(null, user, {
        success: true,
        message: 'Vous êtes connecté',
        obj: {
          nom: user.nom,
          prenom: user.prenom,
          email: email,
          numTel: user.numTel
        }
      });
    });
  }));


  /**
   * Register authenticate
   */
  passport.use('local-register', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
  }, (req, email, password, done) => {

    process.nextTick(() => {

      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, {
            success: false,
            message: 'Cet email est déjà utilisé pour un compte valide'
          });
        } else {

          const newUser = new User({
            nom: req.body.nom,
            prenom: req.body.prenom,
            numTel: req.body.numTel,
            email: email,
            password: password,
            adresse: req.body.adresse
          });

          newUser.save((err, data) => {
            if (err) {
              if (err.code === 11000) {
                return done(null, false, {
                  success: false,
                  message: 'Email already exists'
                });
              } else if (err.errors) {
                if (err.errors.email) {
                  return done(null, false, {
                    success: false,
                    message: err.errors.email.message
                  });
                } else if (err.errors.nom) {
                  return done(null, false, {
                    success: false,
                    message: 'Le nom ne doit pas être vide'
                  });
                } else if (err.errors.prenom) {
                  return done(null, false, {
                    success: false,
                    message: 'Le prenom ne doit pas être vide'
                  });
                } else if (err.errors.password) {
                  return done(null, false, {
                    success: false,
                    message: 'Le mot de passe doit avoir au moins 6 caractères'
                  });
                } else if (err.errors.numTel) {
                  return done(null, false, {
                    success: false,
                    message: 'Le numéro de téléphone est invalide'
                  });
                }
              }
              return done(null, false, {
                success: false,
                message: err
              });
            } else {
              return done(null, newUser, {
                success: true,
                message: 'User registered',
                obj: newUser
              });
            }
          });
        }
      });
    });
  }));

  return passport;
}


