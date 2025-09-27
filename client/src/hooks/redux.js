// client/src/hooks/redux.js
const { useDispatch, useSelector } = require("react-redux");

/**
 * Custom hook to get the Redux dispatch function.
 * @returns {Function}
 */
function useAppDispatch() {
  return useDispatch();
}

/**
 * Custom hook to use the Redux selector.
 * @param {Function} selector
 * @returns {*}
 */
function useAppSelector(selector) {
  return useSelector(selector);
}

module.exports = {
  useAppDispatch,
  useAppSelector,
};
