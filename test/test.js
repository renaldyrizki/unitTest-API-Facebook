'use strict';
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const fb = require("../src/app.js");
const access_token = 'EAAC0ZCH5SricBAHZAfaeXUCBxGcqJm9xyYJWZAt0znQp7ZAAwZBt5kdTKUh6XnzHJjx0vDbAWvkNMA1HqX1ZAgWWxBAEu8cDcerJDgO5knbFciahDOq57CzWTSm3sWxDFZBaOzVMNqYpPt539RL9aBXUzA6YUdQPr8ZCkZCaHVpgNfpOhX3HxcOaDEbeSYo6vTYPKIseAVhUs6AZDZD';
const expired_token = 'EAAC0ZCH5SricBAGJljusUrHrsSAimweHh5LhZCalQSeZB8n6MkTCeDZB2c0p71U1ZBUZCYRBZBR1dnURlJWLkYSHGNqDwaDJvTIkD4qNlsHZBCSX6BPuCtgG04C8WIjzoPkYVJQJ09GlqHIcf5PKqaR1Y9Odq7oyjAatr3t21p91OUxRHKQVHpN7vogkiKeoI5Wac7fXBW7GzQZDZD';
const fp_token = 'EAAC0ZCH5SricBAJKO7BuoJTlGUBWQANBigzvDpMPg5yzPRfp5zZBZA8MC57pxGovu2HZCH3iqOJJZBbSRrObTp1NFFtZCZAALKlVifMPIOKsCeqCAn2NF2ZBdKRVgLwOUJOgdLukIdR3UpEJG8EqQZBvQ25tYPz0ZBmQ56Pf6W2BObSzDZBUUQWoZBEiDNQ0AWAn9KG0vpaXZA0NzDwZDZD';
describe('/GET FP List', () => {
      it('it should GET all FP List', (done) => {
        chai.request(fb)
            .get('/fanspage-list/'+access_token)
            .end((err, res) => {
            	  expect(res).to.be.json;
            	  expect(err).to.be.null;
     			  expect(res).to.have.status(200);
     			  expect(res.body).to.have.property('data');
     			  expect(res.body).to.have.property('length');
                  // res.should.have.status(200);
                  // res.body.should.be.a('array');
                  // res.body.length.should.be.eql(0);
              	done();
            });
      });

      it('expired_token', (done) => {
        chai.request(fb)
            .get('/fanspage-list/'+expired_token)
            .end((err, res) => {
            	  expect(res).to.be.json;
            	  expect(err).to.be.null;
     			  expect(res).to.have.status(200);
     			  expect(res.body).to.have.property('status');
     			  expect(res.body).to.have.property('type');
     			  expect(res.body).to.have.property('code');
     			  expect(res.body).to.have.property('message');
                  // res.should.have.status(200);
                  // res.body.should.be.a('array');
                  // res.body.length.should.be.eql(0);
              	done();
            });
      });

      it('send comment', (done) => {
        chai.request(fb)
            .post('/fanspage-comment/comment/258527638267695_306346323485826/'+fp_token)
            .type('form')
            .send({ msg: 'test'})
            .end((err, res) => {
            	  expect(res).to.be.json;
            	  expect(err).to.be.null;
     			  expect(res).to.have.status(200);
     			  expect(res.body).to.have.property('id');
                  // res.should.have.status(200);
                  // res.body.should.be.a('array');
                  // res.body.length.should.be.eql(0);
              	done();
            });
      });
});


