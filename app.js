const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const moment = require('moment');
const { Idea } = require('./models/Idea');
const { ensureAuthenticated } = require('./helpers/auth');

const app = express();

//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/user');

//Passport config
require('./config/passport')(passport);

//DB config
const db = require('./config/database');

//Connect to mongoose
mongoose
  .connect(db.mongoURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

//Handlebars Helpers
const { formatDate, PDFgenerator } = require('./helpers/hbs');

//Handlebars Middleware
app.engine(
  'handlebars',
  exphbs({
    helpers: {
      formatDate,
      PDFgenerator
    },
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method-override Middleware
app.use(methodOverride('_method'));

//Express-session Middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title //Same as title: title
  });
});

//About Page
app.get('/about', (req, res) => {
  res.render('about');
});

//List all ideas
app.get('/ideas', (req, res) => {
  Idea.find({})
    .populate('user')
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('idea', {
        ideas
      });
    });
});

//Show today's ideas
app.get('/ideas/ideas_on_mentioned_date', (req, res) => {
  const today = moment().startOf('day');
  const tomorrow = moment(today).add(1, 'days');

  Idea.find({
    date: {
      $gte: today.toDate(),
      $lt: tomorrow.toDate()
    }
  })
    .populate('user')
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('todays_ideas', {
        ideas
      });
    });
});

//Use routes
app.use('/ideas', ideas);
app.use('/users', users);

//Server port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = { app };
