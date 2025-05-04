const Joi = require('joi');

const signUpSchema = Joi.object({
    name: Joi.string()
        .min(1) // Ensure name is at least 1 character long
        .required(), // Make name a required field

    email: Joi.string()
        .email()
        .required(),
    
    password: Joi.string()
        .min(6)
        .required()
});

module.exports = {
    signUpSchema
};