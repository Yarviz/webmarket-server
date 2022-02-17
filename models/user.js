const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    email: String,
    phone: String
});

const UserSchema = new mongoose.Schema({
    _id: Number,
    email: { type: String, default: "erkki@email.com" },
    password: { type: String },
    emailVerified: { type: Boolean, default: false },
    createDate: { type: String, default: new Date(Date.now()).toISOString().slice(0,10) },
    contactInfo: {
        type: ContactSchema,
        _id: false,
        default: {
            name: "Erkki",
            email: "erkki2@email.com",
            phone: "1234567"
        }
    }
});

const NewUserProperties = {
    email: { type: "string" },
    password: { type: "string" },
    contactInfo: {
        type: "object",
        properties: {
            name: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" }
        }
    }
}

const NewUserSchema = {
    type: "object",
    properties: NewUserProperties,
    additionalProperties: false,
    required: ['email', 'password']
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