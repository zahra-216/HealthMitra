// client/src/pages/NotFound.jsx
const React = require("react");
const { Link } = require("react-router-dom");
const { Home, ArrowLeft } = require("lucide-react");
const Button = require("@/components/ui/Button");

const NotFound = () => {
  return React.createElement(
    "div",
    { className: "min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4" },
    React.createElement(
      "div",
      { className: "text-center" },
      React.createElement("h1", { className: "text-9xl font-bold text-gray-400" }, "404"),
      React.createElement("h2", { className: "text-2xl font-bold text-gray-900 mt-4" }, "Page not found"),
      React.createElement(
        "p",
        { className: "text-gray-600 mt-2 max-w-md" },
        "Sorry, we couldn't find the page you're looking for."
      ),
      React.createElement(
        "div",
        { className: "mt-8 flex flex-col sm:flex-row gap-4 justify-center" },
        React.createElement(
          Link,
          { to: "/" },
          React.createElement(
            Button,
            { variant: "primary", className: "flex items-center" },
            React.createElement(Home, { className: "h-4 w-4 mr-2" }),
            "Go Home"
          )
        ),
        React.createElement(
          Button,
          { 
            variant: "outline",
            onClick: () => window.history.back(),
            className: "flex items-center"
          },
          React.createElement(ArrowLeft, { className: "h-4 w-4 mr-2" }),
          "Go Back"
        )
      )
    )
  );
};

module.exports = NotFound;
