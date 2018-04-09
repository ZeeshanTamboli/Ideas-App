const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

//Load files - Destructuring
const { app } = require('../app');
const { Idea } = require('../models/Idea');

const ideas = [
  {
    _id: new ObjectID(),
    idea: 'First idea',
    user: new ObjectID()
  },
  {
    _id: new ObjectID(),
    user: new ObjectID(),
    idea: 'Second idea'
  }
];

describe('Ideas', () => {
  beforeEach(done => {
    Idea.remove({})
      .then(() => {
        return Idea.insertMany(ideas);
      })
      .then(() => done());
  });

  describe('POST /ideas/my', () => {
    it('should post an idea', done => {
      let idea = 'Zeeshan';
      request(app)
        .post('/ideas/my')
        .send({ idea })
        .expect(302)
        .end((err, res) => {
          if (err) {
            return done(err); //if it returns it stops the function execution
          }
          done();
        });
    });
  });

  describe('GET /ideas', () => {
    it('should get all ideas', done => {
      request(app)
        .get('/ideas')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe('GET /ideas/my', () => {
    it('should get a users ideas', done => {
      let idea = new Idea({ idea: 'Best idea ever', user: new ObjectID() });
      idea.save((err, idea) => {
        request(app)
          .get('/ideas/my')
          .send(idea)
          .expect(302)
          .end((err, res) => {
            if (err) return done(err);
            Idea.find()
              .then(ideas => {
                expect(ideas.length).toBe(3);
                expect(ideas[2].idea).toBe(idea.idea);
                done();
              })
              .catch(err => done(err));
          });
      });
    });
  });

  describe('DELETE /ideas/my/:id', () => {
    it('should remove an idea', done => {
      const hexId = ideas[1]._id.toHexString();

      request(app)
        .delete(`/ideas/my/${hexId}`)
        .expect(302)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
});
