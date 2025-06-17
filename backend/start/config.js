/**
 * Ensures that JWT private key provided as environment variable
 */

require("dotenv").config();

module.exports = function () {
    if(!process.env.JWT_PRIVATE_KEY) {
        throw new Error("FATAL ERROR: JWT_PRIVATE_KEY not defined");
    }
}