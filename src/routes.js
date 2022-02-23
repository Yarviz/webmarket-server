require('dotenv').config();
const user_schema = require('./models/user');
const posting_schema = require('./models/posting');
const { DataHandler } = require('./handlers');
const jwt = require('jsonwebtoken');

const handler = new DataHandler();
const MAX_IMAGES = 3;
const MAX_USERS = 10;
const MAX_POSTINGS = 100;

const prePostingImage = (req, res, next) => {
    const postings = handler.find_postings(req.params.postingId, req.params.userId, null, null);
    if (!postings.length) {
        return res.status(404).send("posting not found");
    }
    if (postings[0].images.length === MAX_IMAGES) {
        return res.status(400).send("maximum number of images uploaded for posting");
    }
    next();
}

const getIndex = (req, res) => {
    res.sendFile('index.html', {root: __dirname})
}

const getUser = (req, res) => {
    const user = handler.find_user(req.params.userId, null, null);
    if (user == null) {
        return res.status(404).send("user not found");
    }
    delete user.password;
    res.status(200).send(user);
}

const getPostings = (req, res) => {
    const postings = handler.find_postings(null, null, req.query.category, req.query.location, req.query.createDate);
    res.status(200).send(postings);
}

const getUserPostings = (req, res) => {
    const postings = handler.find_postings(req.query.postingId, req.params.userId, null, null, null);
    res.status(200).send(postings);
}

/*const getPostingImage = (req, res) => {
    res.status(503);
    res.send("No Content Yet")
}*/

const loginUser = (req, res) => {
    const { email, password } = req.body;
    const user = handler.find_user(null, email, password);
    if (user == null) {
        return res.status(401).send("invalid username or password");
    }
    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET);
    res.status(200).json({accessToken: token});
}

const postUser = (req, res) => {
    if (handler.count_users() >= MAX_USERS) {
        return res.status(401).send("Maximun number of users created");
    }
    const user = new user_schema.User(req.body);
    const id = handler.save_user(user);
    res.status(200).json({_id: id});
}

const postUserPosting = (req, res) => {
    if (handler.count_postings() >= MAX_POSTINGS) {
        return res.status(401).send("Maximun number of postings created");
    }
    if (handler.find_user(req.params.userId) == null) {
        return res.status(404).send("user not found");
    }
    const posting = new posting_schema.Posting({postingInfo: req.body});
    const id = handler.save_posting(posting, req.params.userId);
    res.status(200).json({_id: id});
}

const postUserPostingImage = (req, res) => {
    if (!req.file) {
        return res.status(400).send("No image in request");
    }
    if (!handler.upload_posting_image(req.params.postingId, req.file.filename)) {
        return res.status(404).send("posting not found");
    }
    res.status(200).json({filename: req.file.filename});
}

const patchUser = (req, res) => {
    const user = handler.patch_user(req.params.userId, req.body);
    if (user == null) {
        return res.status(404).send("user not found");
    }
    delete user.password;
    res.status(200).json(user);
}

const patchUserPosting = (req, res) => {
    const user = handler.find_user(req.params.userId);
    if (user == null) {
        return res.status(404).send("user not found");
    }
    const posting = handler.patch_posting_info(req.params.postingId, req.body);
    if (posting == null) {
        return res.status(404).send("posting not found");
    }
    res.status(200).json(posting);
}

const deleteUserPosting = (req, res) => {
    if (!handler.delete_posting(req.params.postingId, req.params.userId)) {
        return res.status(404).send("posting not found")
    }
    res.status(200).send("posting deleted");
}

const resetAllData = (req, res) => {
    if (!handler.delete_all_data()) {
        return res.status(401).send("no users or postings");
    }
    res.status(200).send("users and postings deleted");
}

module.exports = {
    getIndex,
    getUser,
    getPostings,
    //getPostingImage,
    getUserPostings,
    postUser,
    postUserPosting,
    postUserPostingImage,
    patchUser,
    patchUserPosting,
    deleteUserPosting,
    prePostingImage,
    loginUser,
    resetAllData
}