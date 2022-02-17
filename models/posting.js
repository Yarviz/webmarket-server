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
    postingInfo: {
        type: PostingInfoSchema,
        _id: false,
        default: {
            title: "book",
            description: "nice book",
            category: "books",
            location: "Oulu",
            price: 20,
            deliveryType: "shipping"
        }
    },
    contactInfo: {
        type: ContactSchema,
        _id: false,
        default: {
            name: "Erkki",
            email: "erkki2@email.com",
            phone: "1234567"
        }
    },
    imageURLs: [String]
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