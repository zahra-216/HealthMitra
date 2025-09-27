// client/src/store/store.js
const { configureStore } = require("@reduxjs/toolkit");
const authReducer = require("./slices/authSlice").default;
const healthReducer = require("./slices/healthSlice").default;
const aiReducer = require("./slices/aiSlice").default;
// require other slices as needed

const store = configureStore({
  reducer: {
    auth: authReducer,
    health: healthReducer,
    ai: aiReducer,
    // add other slices here
  },
});

module.exports = store;

// ------------------------
// Type helpers (for TypeScript)
// ------------------------
// If you still use TypeScript, you can export types like this:
module.exports.RootState = /** @type */ (typeof store.getState)();
module.exports.AppDispatch = /** @type */ (typeof store.dispatch)();
