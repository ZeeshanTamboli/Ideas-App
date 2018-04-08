const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const IdeaSchema = new Schema({
  idea: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Idea = mongoose.model('Idea', IdeaSchema);
module.exports = { Idea };
