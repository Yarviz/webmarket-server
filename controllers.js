const user_schema = require('./models/user');
const posting_schema = require('./models/posting');
const { DataHandler } = require('./handlers');

const handler = new DataHandler();

const response = (obj, id, res) => {
    obj._id = id;
    res.status(200).send(obj);
}

const getIndex = (req, res) => {
    res.sendFile('index.html', {root: __dirname})
}

const getUser = (req, res) => {
    let user = handler.find_user(req.params.userId);
    if (user != null) {
        res.status(200).send(user);
    } else {
        res.status(404).send("user not found");
    }
}

const getPosting = (req, res) => {
    let postings = handler.find_postings(null, req.params.userId, req.params.category, req.params.location);
    if (postings.length > 0) {
        res.status(200).send(posting);
    } else {
        res.status(404).send("postings not found");
    }
}

const getUserPosting = (req, res) => {
    let postings = handler.find_postings(req.params.postingId, req.params.userId, null, null);
    if (postings.length > 0) {
        res.status(200).send(postings);
    } else {
        res.status(404).send("postings not found");
    }
}

const getPostingImage = (req, res) => {
    res.status(503);
    res.send("No Content Yet")
}

const postUser = (req, res) => {
    let user = new user_schema.User(req.body);
    let id = handler.save_user(user)
    res.status(200).send({_id: id})
}

const postUserPosting = (req, res) => {
    if (handler.find_user(req.params.userId) == null) {
        res.status(404).send("user not found");
    } else {
        posting = new posting_schema.Posting(req.body);
        id = handler.save_posting(posting, req.params.userId);
        res.status(200).send({_id: id});
    }
}

const postUserPostingImage = (req, res) => {
    res.status(503);
    res.send("No Content Yet")
}

const patchUser = (req, res) => {
    let user = handler.patch_user(req.params.userId, req.body)
    if (user != null) {
        res.status(200).send(user);
    } else {
        res.status(404).send("user not found");
    }
}

const patchUserPosting = (req, res) => {
    let user = handler.find_user(req.params.userId);
    if (user != null) {
        let posting = handler.patch_posting(req.params.postingId)
        if (posting != null) {
            res.status(200).send(posting);
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