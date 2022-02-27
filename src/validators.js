const Ajv = require('ajv');
const add_formats = require('ajv-formats');
const user_schema = require('./models/user');
const posting_schema = require('./models/posting');
const ajv = new Ajv();
const { log } = require('./handlers');
add_formats(ajv);

const validate = (validator) => {
    const cb_function = (req, res, next) => {
        log(`request body: ${JSON.stringify(req.body)}`);
        if (!validator(req.body)) {
            let error = validator.errors[0];
            let err_str = ''
            if (error.instancePath) {
                err_str = error.instancePath.substring(1);
                err_str = err_str.replace("/", ".");
                err_str += ": ";
            }
            err_str += error.message;
            return res.status(406).send(err_str);
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