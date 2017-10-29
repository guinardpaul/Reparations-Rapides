const Compte = require('../models/compte');
const jwt = require('jsonwebtoken');
const config = require('../../app/config/database');

module.exports = (router) => {

  /**
     * Get Compte by Email
     */
  router.get('/email/:email', (req, res, next) => {
    if (!req.params.email) {
      return res.status(409).json({
        success: false,
        message: 'email not provided'
      });
    } else {
      Compte.findOne({ email: req.params.email }).select('nom prenom email adresse numTel').exec((err, compte) => {
        if (err) return next(err);
        if (!compte) {
          res.status(409).json({
            success: false,
            message: 'compte not find'
          });
        } else {
          return res.status(200).json({
            success: true,
            obj: compte
          });
        }
      });
    }
  });

  /**
   * Get Compte by Id
   */
  router.get('/id/:_id', (req, res, next) => {
    if (!req.params._id) {
      res.status(409).json({
        success: false,
        message: 'id not provided'
      });
    } else {
      Compte.findOne({ _id: req.params._id }).select('nom prenom email adresse numTel').exec((err, compte) => {
        if (err) return next(err);
        if (!compte) {
          res.status(409).json({
            success: false,
            message: 'compte not find'
          });
        } else {
          return res.status(200).json({
            success: true,
            obj: compte
          });
        }
      });
    }
  });

  /**
   * Get authorization from JsonWebToken
   */
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

  /**
   * Get Compte using jwt authorization
   */
  router.get('/profile', (req, res, next) => {
    Compte.findById(req.decoded.userId).select('nom prenom email numTel adresse').exec((err, compte) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: err
        });
      } else if (!compte) {
        res.status(400).json({
          success: false,
          message: 'Compte not find'
        });
      } else {
        res.status(200).json({
          success: true,
          obj: compte
        });
      }
    })
  });

  return router;
}