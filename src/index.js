// Env
require('dotenv').config();

// Logging Improvements
require('log-timestamp');

// ESM
require = require("esm")(module);

// Which step are we loading?
let file_to_load = process.argv[2];
require(`./${file_to_load}`);
