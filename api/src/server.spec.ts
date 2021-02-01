
import chai = require('chai')
import chaiHttp = require('chai-http')

import { run } from './server';

chai.use(chaiHttp);
const { expect } = chai;

const testEndPoint = `http://localhost:4848`;
describe('Integration tests', function() {

  this.beforeAll(function () {
    this.server =  run();
  });

  describe('Starting up', function() {
    it('listens to our hacked conf', function() {
      expect(this.server.listening).to.be.true;
    });
  });

  describe('endpoints', function() {

    it('supports main', async function() {
      const res = await chai.request(testEndPoint).get('/').send();
      expect(res).to.have.status(200);
      expect(res).to.be.text;
      expect(res.text).to.equal('Food can be served');
    });
  });

  this.afterAll(function() {
    this.server.close((err: Error) => {
      if (err) { console.error(err); }
      console.log('Closed test server.');
    });
  });

});
