if (process.env.NODE_ENV === 'test') {
  module.exports = {
    mongoURI: 'mongodb://localhost/ideas-test-app'
  };
} else if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: 'mongodb://zeeshan:zeeshan@ds237979.mlab.com:37979/ideas-app'
  };
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/ideas-app'
  };
}
