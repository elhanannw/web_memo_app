/**
 * Declares our user schema, ensures data is valid 
 */

const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { lowerCase } = require("lodash");
require("dotenv").config();

// User model schema
const mongoSchema = mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        lowerCase : true,
    },

    lastName : {
        type : String,
        required : true,
        lowerCase : true,
    },
    
    email : {
        type : String,
        required : true,
    },

    password :  {
        type : String || Number,
        required : true,
    },

    memos : [
        {
            timeStamp : {
                type : Date,
            },
            content : {
                type : String,
                required : true,
            }
        }
    ]

});

// Encrypt mongo id of each user
    mongoSchema.methods.generateAuthToken = function () {
        const token = jwt.sign({_id : this._id}, process.env.JWT_PRIVATE_KEY);
            return token;
    }

const User = mongoose.model('User', mongoSchema);

// REST Validation
function validateUser(user) {
    const schema = Joi.object({
        firstName : Joi.string().required(),
        lastName : Joi.string().required(),
        email : Joi.string().email().required(),
        password : Joi.string().required(),  
    });
    return schema.validate(user);

}

//Export user model

module.exports = {User, validateUser}
