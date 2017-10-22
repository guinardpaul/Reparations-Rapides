const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../../app/config/database');

module.exports = (router) => {

  router.get('/email/:email', (req, res, next) => {
    if (!req.params.email) {
      return res.status(409).json({
        success: false,
        message: 'email not provided'
      });
    } else {
      User.findOne({ email: req.params.email }).select('nom prenom').exec((err, user) => {
        if (err) return next(err);
        if (!user) {
          res.status(409).json({
            success: false,
            message: 'user not find'
          });
        } else {
          return res.status(200).json({
            success: true,
            obj: user
          });
        }
      });
    }
  });

  router.put('/init-password/:_id', (req, res, next) => {
    if (!req.body) {
      res.status(409).json({
        success: false,
        message: 'body not provided'
      });
    } else if (!req.params._id) {
      res.status(409).json({
        success: false,
        message: 'id not provided'
      });
    } else {
      const newUser = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        numTel: req.body.numTel,
        email: req.body.email,
        password: req.body.password
      };
      User.update({ _id: req.params._id }, { password: req.body.password }, (err, user) => {
        if (err) return next(err);
        if (!user) {
          res.status(409).json({
            success: false,
            message: 'user not find'
          });
        } else {
          res.status(200).json({
            success: true,
            message: 'Mot de passe réinitialisé',
            obj: user
          });
        }
      });
    }
  });

  router.use((req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'token not provided'
      });
    } else {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          res.status(401).json({
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
        res.status(500).json({
          success: false,
          message: err
        });
      } else if (!user) {
        res.status(400).json({
          success: false,
          message: 'User not find'
        });
      } else {
        res.status(200).json({
          success: true,
          obj: user
        });
      }
    })
  });


  return router;
}