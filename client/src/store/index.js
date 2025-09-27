// client/src/store/index.js
const store = require("./store");

module.exports = store;
module.exports.RootState = require("./store").RootState;
module.exports.AppDispatch = require("./store").AppDispatch;
