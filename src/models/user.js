const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    email: String,
    phone: String
});

const UserSchema = new mongoose.Schema({
    _id: Number,
    email: { type: String },
    password: { type: String },
    createDate: { type: String, default: new Date(Date.now()).toISOString().slice(0,10) },
    contactInfo: {
        type: ContactSchema,
        _id: false,
    }
});

const NewUserProperties = {
    email: { type: "string", format: "email" },
    password: { type: "string" },
    contactInfo: {
        type: "object",
        properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" },
            phone: { type: "string", pattern: "^[0-9]+$", }
        }
    }
}

const NewUserSchema = {
    type: "object",
    properties: NewUserProperties,
    additionalProperties: false,
    required: ['email', 'password', 'contactInfo']
};

const PatchUserSchema = {
    type: "object",
    properties: NewUserProperties,
    additionalProperties: false
};

const User = mongoose.model("User", UserSchema);

module.exports = {
    User,
    ContactSchema,
    NewUserSchema,
    PatchUserSchema
};