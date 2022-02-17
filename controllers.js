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
    user = handler.find_user(req.params.userId);
    if (user != null) {
        res.status(200).send(user);
    } else {
        res.status(404).send("user not found");
    }
}

const getPosting = (req, res) => {
    let obj = new posting_schema.Posting();
    obj.imageURLs = [`/postings/${req.params.postingId}/images/1.jpg`]
    response(obj, req.params.postingId, res);
}

const getUserPosting = (req, res) => {
    let obj = new posting_schema.Posting();
    obj.imageURLs = [`/postings/${req.params.postingId}/images/1.jpg`]
    response(obj, req.params.postingId, res);
}

const getPostingImage = (req, res) => {
    res.status(503);
    res.send("No Content Yet")
}

const postUser = (req, res) => {
    user = new user_schema.User(req.body);
    id = handler.save_user(user)
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
    user = handler.patch_user(req.params.userId, req.body)
    if (user != null) {
        res.status(200).send(user);
    } else {
        res.status(404).send("user not found");
    }
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