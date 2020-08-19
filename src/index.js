// Environment Loading
require('dotenv').config();

// Timestamps
// require('log-timestamp');

// ESM? I don't know...
require = require("esm")(module/*, options*/);
module.exports = require("./app.js");
