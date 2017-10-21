const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../../app/config/database');

module.exports = (router) => {

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