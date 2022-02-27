require('dotenv').config();
const supertest = require('supertest');
const expect = require('chai').expect;
const test = require('./testdata.js');

const tester = new test.TestData();
const USER_ID = 0;
const OTHER_USER_ID = 1;
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
            const user = tester.get_new_test_user(i)
            const res = await request.post('/user')
                .send(user);
            expect(res.status).to.equal(200);
            expect(res.body.contactInfo).to.eql(user.contactInfo);
            expect(res.body._id).to.eql(i);
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
        const user = tester.get_new_test_user(USER_ID);
        for (i = 0; i < test.MAX_POSTINGS; i++) {
            const posting = tester.get_new_test_posting(i);
            const res = await request.post(`/users/${USER_ID}/posting`)
                .auth(access_token, {type: 'bearer'})
                .send(posting)
            expect(res.status).to.equal(200);
            expect(res.body.postingInfo).to.eql(posting);
            expect(res.body.contactInfo).to.eql(user.contactInfo);
            expect(res.body.user_id).to.eql(USER_ID);
            expect(res.body._id).to.eql(i);
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

describe('Sending invalid parameters', () => {
    it('POST /login should not login with invalid username/password', async() => {
        const res = await request.post('/login')
            .send({"email": "wrong@email.com", "password": "wrong"});
        expect(res.status).to.equal(401);
        expect(res.text).to.eql('invalid username or password');
    });
    it('GET /users/:userId should not return other users info', async() => {
        const res = await request.get(`/users/${OTHER_USER_ID}`)
            .auth(access_token, {type: 'bearer'});
        expect(res.status).to.equal(401);
        expect(res.text).to.eql('Unauthorized');
    });
    it('POST /users/:userId/posting should not allow create other user posting', async() => {
        const res = await request.get(`/users/${OTHER_USER_ID}/posting`)
            .auth(access_token, {type: 'bearer'})
            .send(tester.get_new_test_posting(0));
        expect(res.status).to.equal(401);
        expect(res.text).to.eql('Unauthorized');
    });
    it('PATCH /users/:userId should not allow update user info without token', async() => {
        let res = await request.patch(`/users/${USER_ID}`)
            .send({ email: "veikko@mail.com" })
        expect(res.status).to.equal(401);
        expect(res.text).to.eql('No authorization header');
    });
    it('PATCH /users/:userId should not allow update other user info', async() => {
        let res = await request.patch(`/users/${OTHER_USER_ID}`)
            .auth(access_token, {type: 'bearer'})
            .send({ email: "veikko@mail.com" });
        expect(res.status).to.equal(401);
        expect(res.text).to.eql('Unauthorized');
    });
    it('PATCH /users/:userId/postings/:postingId should not allow user to update non existing posting', async() => {
        let res = await request.patch(`/users/${USER_ID}/postings/${POSTING_ID + 10}`)
            .auth(access_token, {type: 'bearer'})
            .send({ price: 30 })
        expect(res.status).to.equal(404);
        expect(res.text).to.eql('posting not found');
    });
    it('POST /user should not create new users with invalid params', async() => {
        const user = tester.get_new_test_user(1);
        user.email = "not_email";
        const res = await request.post('/user')
            .send(user);
        expect(res.status).to.equal(400);
        expect(res.text).to.eql('email: must match format "email"');
    });
    it('POST /users/:userId/posting should allow user to create postings with invalid params', async() => {
        const posting = tester.get_new_test_posting(0);
        delete posting.location;
        const res = await request.post(`/users/${USER_ID}/posting`)
            .auth(access_token, {type: 'bearer'})
            .send(posting)
        expect(res.status).to.equal(400);
        expect(res.text).to.eql("must have required property 'location'");
    });
    it('DELETE /users/:userId/postings/:postingId should not allow user to delete other user posting', async() => {
        let res = await request.delete(`/users/${OTHER_USER_ID}/postings/${POSTING_ID}`)
            .auth(access_token, {type: 'bearer'})
        expect(res.status).to.equal(401);
        expect(res.text).to.eql('Unauthorized');
    });
});

describe('Resetting Data', () => {
    it('DELETE /users/:userId/postings/:postingId should allow user to delete posting', async() => {
        let res = await request.delete(`/users/${USER_ID}/postings/${POSTING_ID}`)
            .auth(access_token, {type: 'bearer'})
        expect(res.status).to.equal(200);
        expect(res.text).to.eql('posting deleted');
    });
    it('DELETE /reset should delete all users, postings and posting images', async() => {
        const res = await request.delete(`/reset`)
        expect(res.status).to.equal(200);
        expect(res.text).to.eql('users and postings deleted');
    });
});