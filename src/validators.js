const Ajv = require('ajv');
const user_schema = require('./models/user');
const posting_schema = require('./models/posting');
const ajv = new Ajv();
const { log } = require('./handlers');

const validate = (validator) => {
    const cb_function = (req, res, next) => {
        log(`request body: ${JSON.stringify(req.body)}`);
        if (!validator(req.body)) {
            return res.status(406).send(validator.errors[0].message);
        }
        next()
    }
    return cb_function;
}

const new_user_validator = validate(ajv.compile(user_schema.NewUserSchema));
const new_posting_validator = validate(ajv.compile(posting_schema.NewPostingSchema));
const patch_user_validator = validate(ajv.compile(user_schema.PatchUserSchema));
const patch_posting_validator = validate(ajv.compile(posting_schema.PatchPostingSchema));

module.exports = {
    new_user_validator,
    new_posting_validator,
    patch_user_validator,
    patch_posting_validator
}