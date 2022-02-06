const user_schema = require('./models/user');
const posting_schema = require('./models/posting');
const { DataHandler } = require('./handlers');

handler = new DataHandler();

const response = (obj, id, res) => {
    obj._id = id;
    res.status(200).send(obj);
}

const getIndex = (req, res) => {
    res.sendFile('index.html', {root: __dirname})
}

const getUser = (req, res) => {
    response(new user_schema.User(), req.params.userId, res);
}

const getPosting = (req, res) => {
    let obj = new posting_schema.Posting();
    obj.imageURLs = [`/postings/${req.params.postingId}/images/1.jpg`]
    response(obj, req.params.postingId, res);
}

const getPostingImage = (req, res) => {
    res.status(503);
    res.send("No Content Yet")
}

const getUserPosting = (req, res) => {
    let obj = new posting_schema.Posting();
    obj.imageURLs = [`/postings/${req.params.postingId}/images/1.jpg`]
    response(obj, req.params.postingId, res);
}

const postUser = (req, res) => {
    user = new user_schema.User(req.body);
    handler.save_user(user)
    res.status(503);
    res.send("No Content Yet")
}

const postUserPosting = (req, res) => {
    validate(new_posting_validator, req, res);
}

const postUserPostingImage = (req, res) => {
    res.status(503);
    res.send("No Content Yet")
}

const patchUser = (req, res) => {
    res.status(503);
    res.send("No Content Yet")
}

const patchUserPosting = (req, res) => {
    res.status(503);
    res.send("No Content Yet")
}

const deleteUserPosting = (req, res) => {
    res.status(200);
    res.send(`Posting ${req.params.postingId} Deleted`)
}

module.exports = {
    getIndex,
    getUser,
    getPosting,
    getPostingImage,
    getUserPosting,
    postUser,
    postUserPosting,
    postUserPostingImage,
    patchUser,
    patchUserPosting,
    deleteUserPosting
}