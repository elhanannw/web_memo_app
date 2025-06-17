/**
 * Router connecting processes to DB
 */

const express = require("express");
const router = express.Router();
const {User, validateUser} = require("../models/user");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const _ = require("lodash");

// Account creation API
router.post("/create-account", async (req, res) => {
    const {error} = validateUser(req.body);

    // If wrong user, send error
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Find from DB 
    let user = await User.findOne({email : req.body.email});

    // If user exists, send message
    if (user) {
        return res.status(400).send("User already exists");
    }

    // If not, create a new user using the inputted data
    user = new User(_.pick(req.body, ["firstName", "lastName", "email", "password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    const token = user.generateAuthToken();
    user.save();

    return res.send("Successfully Registered");

});

// Ensure data in right format
function validateSignIn(credentials) {
    const schema = Joi.object({
        email : Joi.string().email().required(),
        password : Joi.string().required(),
    });
    return schema.validate(credentials);
}

//  Sign-in API
router.post("/sign-in", async (req, res) => {
    const {error} = validateSignIn(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({email : req.body.email});

    if (!user) {
        return res.status(400).send("Invalid email or password");
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
        return res.status(400).send("Invalid email or password");
    }

    const token = user.generateAuthToken();
    response = {"token" : token, "email" : user.email, "Memos" : user.memos};
    return res.send(response);
});

// Adding memo
function validateMemo(content) {
    const schema = Joi.object({
        content : Joi.string().required(),
    });
    return schema.validate(content);
}

router.post("/add-memo", auth, async (req, res) => {
    const {error} = validateMemo(req.body);

    if (error) {
        return res.status(400).send("Invalid add-memo request");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(400).send("Unauthorised Action");
    }

    user.memos.push({
        timeStamp : Date(),
        content : req.body.content,
    });

    user.save();
    return res.send(user.memos);
});

// Delete Memo
function validateDeleteMemo(content) {
    const schema = Joi.object({
        index : Joi.number().integer().required(),
    });
    return schema.validate(content);
}

router.post("/delete-memo", auth, async (req, res) => {
    const {error} = validateDeleteMemo(req.body);

    if (error) {
        return res.status(400).send("Invalid delete-memo request");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(400).send("Unauthorised Action");
    }

    user.memos.splice(req.body.index, 1);
    user.save();
    return res.send(user.memos);
});

//Exports

module.exports = router;