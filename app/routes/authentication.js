//const User = require('../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../../app/config/database');
const passport = require('passport');

module.exports = (router) => {

  /**
   * Register User
   */
  router.post('/register', (req, res, next) => {
    if (!req.body.nom) {
      res.json({
        success: false,
        message: 'Nom not provided'
      });
    } else if (!req.body.prenom) {
      res.json({
        success: false,
        message: 'Prenom not provided'
      });
    } else if (!req.body.email) {
      res.json({
        success: false,
        message: 'Email not provided'
      });
    } else if (!req.body.password) {
      res.json({
        success: false,
        message: 'Password not provided'
      });
    } else if (!req.body.numTel) {
      res.json({
        success: false,
        message: 'Tel not provided'
      });
    } else {
      // User body
      let user = new User({
        nom: req.body.nom,
        prenom: req.body.prenom,
        password: req.body.password,
        email: req.body.email.toLowerCase(),
        numTel: req.body.numTel
      });

      user.save((err, data) => {
        if (err) {
          if (err.code === 11000) {
            res.json({
              success: false,
              message: 'Email already exists'
            });
          } else if (err.errors) {
            if (err.errors.email) {
              res.json({
                success: false,
                message: err.errors.email.message
              });
            } else if (err.errors.nom) {
              res.json({
                success: false,
                message: 'Le nom ne doit pas être vide'
              });
            } else if (err.errors.prenom) {
              res.json({
                success: false,
                message: 'Le prenom ne doit pas être vide'
              });
            } else if (err.errors.password) {
              res.json({
                success: false,
                message: 'Le mot de passe doit avoir au moins 6 caractères'
              })
            } else if (err.errors.numTel) {
              res.json({
                success: false,
                message: 'Le numéro de téléphone est invalide'
              })
            }
          }
          res.json({
            success: false,
            message: err
          });
        } else {
          res.json({
            success: true,
            obj: data,
            message: data.nom + ' ' + data.prenom + ' registered'
          });
        }
      });
    }
  });

  /**
   * Login User
   */
  router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      var token;

      // If Passport throws/catches an error
      if (err) {
        res.status(404).json(err);
        return;
      }

      // If a user is found
      if (user) {
        token = user.generateToken(user._id);
        res.status(200);
        res.json({
          token: token,
          info: info
        });
      } else {
        // If user is not found
        res.status(401).json(info);
      }
    })(req, res, next);
  });

  router.use((req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
      res.json({
        success: false,
        message: 'token not provided'
      });
    } else {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          res.json({
            success: false,
            message: 'token invalid'
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    }
  });

  router.get('/profile', (req, res, next) => {
    User.findById(req.decoded.userId).select('nom prenom email').exec((err, user) => {
      if (err) {
        res.json({
          success: false,
          message: err
        });
      } else if (!user) {
        res.json({
          success: false,
          message: 'User not find'
        });
      } else {
        res.json({
          success: true,
          obj: user
        });
      }
    })
  });

  return router;
}