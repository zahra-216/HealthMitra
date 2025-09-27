const React = require("react");
const { clsx } = require("clsx");

const Card = ({ children, className }) =>
  React.createElement("div", { className: clsx("card", className) }, children);
const CardHeader = ({ children, className }) =>
  React.createElement(
    "div",
    { className: clsx("card-header", className) },
    children
  );
const CardTitle = ({ children, className }) =>
  React.createElement(
    "h3",
    { className: clsx("card-title", className) },
    children
  );
const CardDescription = ({ children, className }) =>
  React.createElement(
    "p",
    { className: clsx("card-description", className) },
    children
  );
const CardContent = ({ children, className }) =>
  React.createElement(
    "div",
    { className: clsx("card-content", className) },
    children
  );

module.exports = { Card, CardHeader, CardTitle, CardDescription, CardContent };
