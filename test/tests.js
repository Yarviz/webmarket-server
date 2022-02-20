const server = require('../src/server.js');
const supertest = require('supertest');
const expect = require('chai').expect;
const request = supertest(server);
const test = require('./testdata.js');

const tester = new test.TestData();

describe('User Endpoints', () => {
    it('POST /user should create new users', async() => {
        for (i = 0; i < test.MAX_USERS; i++) {
            const res = await request.post('/user')
                .send(tester.get_new_test_user(i));
            expect(res.status).to.equal(200);
            expect(res.body).to.eql({_id: i});
        }
    });
});