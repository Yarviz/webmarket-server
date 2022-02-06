const express = require('express');
const bodyparser = require('body-parser');
const routes = require('./controllers');
const validator = require('./validators');
//const mongoose = require('mongoose');

const app = express();
const port = 3000

app.use(bodyparser.json());

//mongoose.connect("mongodb://localhost/test", () => {
//    console.log("connected to database");
//})

app.get('/', routes.getIndex);
app.get('/users/:userId', routes.getUser);
app.get('/users/:userId/postings/:postingId', routes.getUserPosting);
app.get('/postings', routes.getPosting);
app.get('/postings/:postingId/images/:imageId', routes.getPostingImage);
app.post('/user', validator.new_user_validator, routes.postUser);
app.post('/users/:userId/posting', validator.new_posting_validator,routes.postUserPosting);
app.post('/users/:userId/postings/:postingId/image', routes.postUserPostingImage);
app.patch('/users/:userId', validator.patch_user_validator, routes.patchUser);
app.patch('/users/:userId/postings/:postingId', validator.patch_posting_validator, routes.patchUserPosting);
app.delete('/users/:userId/postings/:postingId', routes.deleteUserPosting);

app.listen(port, () => {
    console.log(`Starting server on port: ${port}`)
});