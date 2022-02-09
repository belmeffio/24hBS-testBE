// TODO:
// This is uncompleted, it should have become the test path for the API, using chai and mocha. 
// But there was no time left.

// The purpose here is to test each endpoint with expected result, to ensure that even after lots of upgrading it still behave accordingly to the spoecifics


//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
const { application } = require("express")
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Jokes', () => {
  /*
  * Test the /GET route
  */
  describe('/GET jokes', () => {
      it('it should GET all the jokes', (done) => {
        chai.request(server)
            .get('/jokes')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
              done();
            });
      });
  });

});
