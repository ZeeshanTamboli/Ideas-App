const express = require('express');
const router = express.Router();

//Load helper
const { ensureAuthenticated } = require('../helpers/auth');

//Load Idea Model - Destructuring
const { Idea } = require('../models/Idea');

//A User's Idea Page
router.get('/my', ensureAuthenticated, (req, res) => {
  Idea.find({ user: req.user.id })
    .sort({ date: 'desc' })
    .populate('user')
    .then(ideas => {
      res.render('ideas/index', {
        ideas
      });
    });
});

//List ideas from a user
router.get('/user/:userId', (req, res) => {
  Idea.find({ user: req.params.userId })
    .populate('user')
    .sort({ date: 'desc' })
    .then(ideas => {
      console.log(ideas);
      res.render('ideas/show', {
        ideas,
        firstName: ideas[0].user.firstName
      });
    });
});

//Add Idea Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

//Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    if (idea.user != req.user.id) {
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/ideas/my');
    } else {
      res.render('ideas/edit', {
        idea
      });
    }
  });
});

//Process form - POST
router.post('/my', ensureAuthenticated, (req, res) => {
  let errors = [];

  if (!req.body.idea) {
    errors.push({ text: 'Please add an idea' });
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors, //Same as errors: errors
      idea: req.body.idea
    });
  } else {
    const newUser = {
      idea: req.body.idea,
      user: req.user.id
    };
    new Idea(newUser).save().then(idea => {
      req.flash('success_msg', 'Idea has been added');
      res.redirect('/ideas/my');
    });
  }
});

//Edit form process
router.put('/my/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    //new values
    idea.idea = req.body.idea;
    idea.save().then(idea => {
      req.flash('success_msg', 'Idea has been updated');
      res.redirect('/ideas/my');
    });
  });
});

//Delete idea
router.delete('/my/:id', ensureAuthenticated, (req, res) => {
  Idea.remove({
    _id: req.params.id
  }).then(() => {
    req.flash('success_msg', 'Idea Removed');
    res.redirect('/ideas/my');
  });
});

module.exports = router;
