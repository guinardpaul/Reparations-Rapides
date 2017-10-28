const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../../app/config/database');

module.exports = (router, passport) => {

  /**
   * Vérification session user pour route profile
   * @returns isAuthenticated()
   */
  /* function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({
      success: false,
      message: 'Vous devez être connecté pour accéder à cette page',
      redirect: '/login'
    });
  }; */

  /**
   * Register User
   */
  router.post('/register', (req, res, next) => {
    if (!req.body.nom) {
      res.status(409).json({
        success: false,
        message: 'Nom not provided'
      });
    } else if (!req.body.prenom) {
      res.status(409).json({
        success: false,
        message: 'Prenom not provided'
      });
    } else if (!req.body.email) {
      res.status(409).json({
        success: false,
        message: 'Email not provided'
      });
    } else if (!req.body.password) {
      res.status(409).json({
        success: false,
        message: 'Password not provided'
      });
    } else if (!req.body.numTel) {
      res.status(409).json({
        success: false,
        message: 'Tel not provided'
      });
    } else if (!req.body.adresse) {
      res.status(409).json({
        success: false,
        message: 'Adresse not provided'
      });
    } else {
      passport.authenticate('local-register', function (err, user, info) {
        if (err) {
          return next(err); // will generate a 500 error
        }
        if (!user) {
          return res.status(409).json(info);
        }
        // USED ?
        req.login(user, function (err) {
          if (err) {
            return next(err);
          }
          return res.status(200).json(info);
        });
      })(req, res, next);
    }
  });

  /**
   * Login User
   */
  router.post('/login', (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
      let token;

      // If Passport throws/catches an error
      if (err) {
        res.status(404).json(err);
        return;
      }

      // If a user is found
      if (user) {
        token = user.generateToken(user._id);
        res.status(200).json({
          token: token,
          info: info
        });
        req.login(user, (err) => {
          if (err) return next(err);
        });
      } else {
        // If user is not found
        res.status(401).json(info);
      }
    })(req, res, next);
  });

  return (router);
}