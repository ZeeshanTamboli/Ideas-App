const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//Load User Model - Destructuring
const { User } = require('../models/User');

//User Login route
router.get('/login', (req, res) => {
  res.render('users/login');
});

//Login form post
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas/my',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

//User register route
router.get('/register', (req, res) => {
  res.render('users/register');
});

//Register form post
router.post('/register', (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Passwords do not match' });
  }

  if (req.body.password.length < 6) {
    errors.push({ text: 'Passwords must be atleast 6 characters' });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash('error_msg', 'Email already registered');
        res.redirect('/users/register');
      } else {
        const newUser = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password
        };

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            new User(newUser)
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can login'
                );
                res.redirect('/users/login');
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

//Logout User
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
