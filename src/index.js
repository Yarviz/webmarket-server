const express = require('express');
const bodyparser = require('body-parser');
const routes = require('./routes');
const validator = require('./validators');
const morgan = require('morgan');
const multer = require('multer');
const { authenticateJWT } = require('./authenticator');
//const jwt = require('jsonwebtoken');
//const mongoose = require('mongoose');

const fileFilter = (req, file, cb) => {
    if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
        cb (null, true)
    } else {
        cb (null, false)
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "_" + file.originalname)
    }
})
const upload = multer({ storage: storage, fileFilter: fileFilter });
const app = express();
const port = 3000

app.use(bodyparser.json());
app.use('/images', express.static(__dirname + '/public'), (req, res) => {
    res.status(404).send("image not found");
});
app.use(morgan('tiny'));

//mongoose.connect("mongodb://localhost/test", () => {
//    console.log("connected to database");
//})

app.get('/', routes.getIndex);
app.get('/users/:userId', routes.getUser);
app.get('/users/:userId/posting', authenticateJWT, routes.getUserPostings);
app.get('/postings', routes.getPostings);
app.get('/postings/:postingId/images/:imageId', routes.getPostingImage);
app.post('/login', routes.loginUser);
app.post('/user', validator.new_user_validator, routes.postUser);
app.post('/users/:userId/posting', validator.new_posting_validator,routes.postUserPosting);
app.post('/users/:userId/postings/:postingId/image', routes.prePostingImage, upload.single('PostingImage'), routes.postUserPostingImage);
app.patch('/users/:userId', validator.patch_user_validator, routes.patchUser);
app.patch('/users/:userId/postings/:postingId', validator.patch_posting_validator, routes.patchUserPosting);
app.delete('/users/:userId/postings/:postingId', routes.deleteUserPosting);

app.listen(port, () => {
    console.log(`Starting server on port: ${port}`)
});