// Environment Loading
require('dotenv').config();

// ESM? I don't know...
require = require("esm")(module/*, options*/);
module.exports = require("./app.js");
