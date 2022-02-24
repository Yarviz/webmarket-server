require('dotenv').config();
const supertest = require('supertest');
const expect = require('chai').expect;
const test = require('./testdata.js');

const tester = new test.TestData();
const USER_ID = 0;
const POSTING_ID = 0;
var access_token = null;
var image_file = null;
var request;

const args = process.argv.slice(2);
if (args.length > 0 && args[0] === '-remote') {
    request = supertest(process.env.APP_URL);
    console.log(`Using remote server for tests, URL: ${process.env.APP_URL}`);
} else {
    const server = require('../src/server.js');
    request = supertest(server);
}

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
            .send(tester.get_test_login(USER_ID));
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('accessToken');
        access_token = res.body.accessToken;
    });
});

describe('User Accessing', () => {
    it('GET /users/:userId should return correct user info', async() => {
        const res = await request.get(`/users/${USER_ID}`)
            .auth(access_token, {type: 'bearer'});
        expect(res.status).to.equal(200);
    });
    it('POST /users/:userId/posting should allow logged user to create postings', async() => {
        for (i = 0; i < test.MAX_POSTINGS; i++) {
            const res = await request.post(`/users/${USER_ID}/posting`)
                .auth(access_token, {type: 'bearer'})
                .send(tester.get_new_test_posting(i))
            expect(res.status).to.equal(200);
            expect(res.body).to.eql({_id: i});
        }
    });
    it('PATCH /users/:userId/postings/:postingId should allow user to update posting', async() => {
        let res = await request.patch(`/users/${USER_ID}/postings/${POSTING_ID}`)
            .auth(access_token, {type: 'bearer'})
            .send({ price: 30 })
        expect(res.status).to.equal(200);
        expect(res.body.postingInfo.price).to.equal(30);
        // patch posting back to prevent other test to fail
        res = await request.patch(`/users/${USER_ID}/postings/${POSTING_ID}`)
            .auth(access_token, {type: 'bearer'})
            .send({ price: 10 })
        expect(res.status).to.equal(200);
    });
    it('PATCH /users/:userId should allow user to update user info', async() => {
        let res = await request.patch(`/users/${USER_ID}`)
            .auth(access_token, {type: 'bearer'})
            .send({ email: "veikko@mail.com" })
        expect(res.status).to.equal(200);
        expect(res.body.email).to.equal("veikko@mail.com");
    });
});

describe('Image Upload/Download', () => {
    it('POST /users/:userId/postings/:postingId/image should allow user to upload image for posting', async() => {
        let res = await request.post(`/users/${USER_ID}/postings/${POSTING_ID}/image`)
            .auth(access_token, {type: 'bearer'})
            .field('Content-Type', 'multipart/form-data')
            .attach('PostingImage', 'test/test.png')
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('filename');
        image_file = res.body.filename;
    });
    it('GET /images should return image for correct filename', async() => {
        let res = await request.get(`/images/${image_file}`)
        expect(res.status).to.equal(200);
        expect('Content-Type', 'image.png')
    });
});

describe('Public Accessing', () => {
    it('GET / should return openapi HTML page', async() => {
        const res = await request.get(`/`);
        expect(res.status).to.equal(200);
        expect(res.headers['content-type']).to.have.string('text/html');
    });
    it('GET /postings without query params should return all postings', async() => {
        const res = await request.get(`/postings`);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(3);
        for(const posting of res.body) {
            expect(posting.user_id).to.equal(USER_ID);
            expect(posting.contactInfo).to.eql(tester.get_new_test_user(USER_ID).contactInfo);
            expect(posting.postingInfo).to.eql(tester.get_new_test_posting(posting._id));
        }
    });
    it('GET /postings with query params should return correct postings', async() => {
        const res = await request.get(`/postings`)
            .query({ category: "books" })
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(2);
        for(const posting of res.body) {
            expect(posting.postingInfo.category).to.equal("books");
        }
    });
});

describe('Resetting Data', () => {
    it('DELETE /reset should delete all users, postings and posting images', async() => {
        const res = await request.delete(`/reset`)
        expect(res.status).to.equal(200);
        expect(res.text).to.eql('users and postings deleted');
    });
})