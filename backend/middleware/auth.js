/**
 * Auth is handles the authentication
 */
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Export
// Check if the authentication token is valid
module.exports = function(req, res, next) {

    const token = req.header("x-auth-token");
    if(!token) return res.status(401).send("Access Denied, no token provided");

    try {

        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        req.user = decoded;
        next();

    } catch (error) {

        return res.status(401).send("Invalid User");

    }

}