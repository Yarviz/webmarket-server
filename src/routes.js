const user_schema = require('./models/user');
const posting_schema = require('./models/posting');
const { DataHandler } = require('./handlers');
const jwt = require('jsonwebtoken');

const handler = new DataHandler();
const MAX_IMAGES = 3;
const TOKEN_SECRET = "testTokenSecret";

const prePostingImage = (req, res, next) => {
    const postings = handler.find_postings(req.params.postingId, req.params.userId, null, null);
    console.log(postings);
    if (!postings.length) {
        res.status(404).send("posting not found");
    } else {
        if (postings[0].images.length === MAX_IMAGES) {
            res.status(400).send("maximum number of images uploaded for posting");
        } else {
            next();
        }
    }
}

const getIndex = (req, res) => {
    res.sendFile('index.html', {root: __dirname})
}

const getUser = (req, res) => {
    const user = handler.find_user(req.params.userId, null, null);
    if (user != null) {
        res.status(200).send(user);
    } else {
        res.status(404).send("user not found");
    }
}

const getPostings = (req, res) => {
    const postings = handler.find_postings(null, null, req.query.category, req.query.location, req.query.createDate);
    res.status(200).send(postings);
}

const getUserPostings = (req, res) => {
    const postings = handler.find_postings(req.query.postingId, req.params.userId, null, null, null);
    res.status(200).send(postings);
}

const getPostingImage = (req, res) => {
    res.status(503);
    res.send("No Content Yet")
}

const loginUser = (req, res) => {
    const { email, password } = req.body;
    const user = handler.find_user(null, email, password);
    if (user != null) {
        const token = jwt.sign({ userid: user._id }, TOKEN_SECRET);
        res.status(200).json({accessToken: token});
    } else {
        res.status(401).send("invalid username or password");
    }
}

const postUser = (req, res) => {
    const user = new user_schema.User(req.body);
    const id = handler.save_user(user);
    res.status(200).send({_id: id});
}

const postUserPosting = (req, res) => {
    if (handler.find_user(req.params.userId) == null) {
        res.status(404).send("user not found");
    } else {
        const posting = new posting_schema.Posting({postingInfo:req.body});
        const id = handler.save_posting(posting, req.params.userId);
        res.status(200).json({_id: id});
    }
}

const postUserPostingImage = (req, res) => {
    if (!req.file) {
        res.status(400).send("No image in request");
    } else {
        if (handler.upload_posting_image(req.params.postingId, req.file.filename)) {
            res.status(200).json({filename: req.file.filename});
        } else {
            res.status(404).send("posting not found");
        }
    }
}

const patchUser = (req, res) => {
    const user = handler.patch_user(req.params.userId, req.body)
    if (user != null) {
        res.status(200).json(user);
    } else {
        res.status(404).send("user not found");
    }
}

const patchUserPosting = (req, res) => {
    const user = handler.find_user(req.params.userId);
    if (user != null) {
        const posting = handler.patch_posting(req.params.postingId)
        if (posting != null) {
            res.status(200).json(posting);
        } else {
            res.status(404).send("posting not found");
        }
    } else {
        res.status(404).send("user not found");
    }
}

const deleteUserPosting = (req, res) => {
    if (handler.delete_posting(req.params.postingId, req.params.userId)) {
        res.status(200).send("posting deleted");
    } else {
        res.status(404).send("posting not found")
    }
}

module.exports = {
    getIndex,
    getUser,
    getPostings,
    getPostingImage,
    getUserPostings,
    postUser,
    postUserPosting,
    postUserPostingImage,
    patchUser,
    patchUserPosting,
    deleteUserPosting,
    prePostingImage,
    loginUser
}