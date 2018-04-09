const moment = require('moment');
const { Idea } = require('../models/Idea');
const mongoose = require('mongoose');

//DB config
const db = require('../config/database');

//Connect to mongoose
mongoose
  .connect(db.mongoURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

const today = moment().startOf('day');
const tomorrow = moment(today).add(1, 'days');

Idea.find({
  date: {
    $gte: today.toDate(),
    $lt: tomorrow.toDate()
  }
}).then(ideas => {
  for (let i = 0; i < ideas.length; i++) {
    console.log(ideas[i].idea);
  }
});
