const React = require("react");
const { Loader2 } = require("lucide-react");
const { clsx } = require("clsx");

const LoadingSpinner = ({ size = "md", text, className }) => {
  const sizeClasses = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-8 w-8" };
  return React.createElement(
    "div",
    { className: clsx("flex items-center justify-center", className) },
    React.createElement(Loader2, {
      className: clsx("animate-spin text-primary-600", sizeClasses[size]),
    }),
    text &&
      React.createElement(
        "span",
        { className: "ml-2 text-sm text-gray-600" },
        text
      )
  );
};

module.exports = LoadingSpinner;
