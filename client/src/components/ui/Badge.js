// client/src/components/ui/Badge.js
const React = require("react");
const { clsx } = require("clsx");

const Badge = ({ variant = "default", children, className }) => {
  const variantClasses = {
    default: "badge-default",
    primary: "badge-primary",
    success: "badge-success",
    warning: "badge-warning",
    danger: "badge-danger",
  };

  return React.createElement(
    "span",
    { className: clsx("badge", variantClasses[variant], className) },
    children
  );
};

module.exports = Badge;
