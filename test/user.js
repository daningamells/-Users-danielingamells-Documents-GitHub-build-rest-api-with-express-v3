// during the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../models/user');

// require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/index');
let should = chai.should();

chai.use(chaiHttp);

// our parent block
describe('User', () => {

// test the /GET route

  describe('/api/user -- pass', () => {
      it('should validate', (done) => {
        chai.request(server)
            .get('/api/users')
            .auth('test2@smith.com', 'password')
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
  });

  describe('/api/user -- fail', () => {
      it('should fail to validate', (done) => {
        chai.request(server)
            .get('/api/users')
            .end((err, res) => {
                  res.should.have.status(403);
              done();
            });
      });
  });

});
