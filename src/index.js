// ESM
// I believe this package lets me use "import" over "require()"
require = require("esm")(module);

// Env
require('dotenv').config();

// Which step are we loading?
let file_to_load = process.argv[2];
require(`./${file_to_load}`);
