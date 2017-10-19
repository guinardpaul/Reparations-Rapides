const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
  uri: 'mongodb://localhost/GP-ReparationRapides',
  secret: crypto,
  db: 'GP-ReparationRapides'
};