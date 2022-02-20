const server = require('../src/server.js');
const supertest = require('supertest');
const expect = require('chai').expect;
const request = supertest(server);
const test = require('./testdata.js');

const tester = new test.TestData();
var access_token = null;

describe('User Creating', () => {
    it('POST /user should create new users', async() => {
        for (i = 0; i < test.MAX_USERS; i++) {
            const res = await request.post('/user')
                .send(tester.get_new_test_user(i));
            expect(res.status).to.equal(200);
            expect(res.body).to.eql({_id: i});
        }
    });
    it('POST /login should log in with correct email/password', async() => {
        const res = await request.post('/login')
            .send(tester.get_test_login(0));
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('accessToken');
        access_token = res.body.accessToken;
    });
});

describe('User Accessing', () => {
    it('GET /users/:userId should return correct user info', async() => {
        const res = await request.get('/users/0')
            .auth(access_token, {type: 'bearer'});
        expect(res.status).to.equal(200);
        //console.log(res.body);
    });
});