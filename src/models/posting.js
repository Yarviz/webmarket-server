const mongoose = require('mongoose');
const { ContactSchema } = require('./user')

const PostingInfoSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    location: String,
    price: Number,
    deliveryType: String
});

const PostingSchema = new mongoose.Schema({
    _id: Number,
    createDate: { type: String, default: new Date(Date.now()).toISOString().slice(0,10) },
    postingInfo: {
        type: PostingInfoSchema,
        _id: false,
    },
    user_id: Number,
    contactInfo: {
        type: ContactSchema,
    },
    images: [String]
});

const NewPostingProperties = {
    title: { type: "string" },
    description: { type: "string" },
    category: { type: "string" },
    location: { type: "string" },
    price: { type: "number" },
    deliveryType: { enum: ["shipping", "pickup"] }
};

const NewPostingSchema = {
    type: "object",
    properties: NewPostingProperties,
    additionalProperties: false,
    required: ['title', 'description', 'category', 'location', 'price', 'deliveryType']
};

const PatchPostingSchema = {
    type: "object",
    properties: NewPostingProperties,
    additionalProperties: false
};

const Posting = mongoose.model("Posting", PostingSchema);

module.exports = {
    Posting,
    NewPostingSchema,
    PatchPostingSchema
};