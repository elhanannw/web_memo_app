const express = require("express");

const app = express();

require("./start/config")();
require("./start/routes")(app);
require("./start/db")();

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log("Listening to port " + port);
});