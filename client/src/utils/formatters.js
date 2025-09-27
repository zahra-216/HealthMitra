// client/src/utils/formatters.js

/**
 * Format a date string or Date object into "DD MMM YYYY" format.
 * @param {string|Date} date
 * @returns {string}
 */
function formatDate(date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

module.exports = {
  formatDate,
};
