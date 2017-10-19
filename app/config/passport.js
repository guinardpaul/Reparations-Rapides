var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

passport.use(new LocalStrategy({
  usernameField: 'email'
}, (username, password, done) => {
  User.findOne({ email: username }, (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false, {
      message: 'Le Compte n\'existe pas'
    });
    if (!user.comparePassword(password))
      return done(null, false, {
        message: 'Mauvais password'
      });
    return done(null, user, { obj: user });
  });
}));

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});