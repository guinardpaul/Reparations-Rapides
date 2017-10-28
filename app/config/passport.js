const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const Compte = require('../models/compte');

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

      Compte.findById(user.compte, (err, compte) => {
        if (err) return next(err);
        if (!compte) {
          return done(null, false, {
            success: false,
            message: 'Erreur durant la récupération du compte utilisateur'
          });
        } else {
          // Authentication réussie
          return done(null, user, {
            success: true,
            message: 'Vous êtes connecté',
            obj: {
              nom: compte.nom,
              prenom: compte.prenom,
              email: email,
              numTel: compte.numTel,
              adresse: compte.adresse
            }
          });
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
          const newCompte = new Compte({
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: email,
            adresse: req.body.adresse,
            numTel: req.body.numTel
          });

          newCompte.save((err, compte) => {
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
              console.log('Compte saved');
              console.log(compte);

              const newUser = new User({
                email: email,
                password: password,
                compte: compte._id
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
                    } else if (err.errors.password) {
                      return done(null, false, {
                        success: false,
                        message: 'Le mot de passe doit avoir au moins 6 caractères'
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
        }
      });
    });
  }));

  return passport;
}


