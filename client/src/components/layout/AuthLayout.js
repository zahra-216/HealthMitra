// client/src/components/layout/AuthLayout.js
const React = require("react");
const { Outlet } = require("react-router-dom");
const { Heart, Shield, Users } = require("lucide-react");

const AuthLayout = () => {
  return React.createElement(
    "div",
    {
      className:
        "min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex",
    },
    // Left Side - Branding
    React.createElement(
      "div",
      {
        className:
          "hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12",
      },
      React.createElement(
        "div",
        { className: "max-w-md" },
        // Logo
        React.createElement(
          "div",
          { className: "flex items-center mb-8" },
          React.createElement(
            "div",
            { className: "bg-primary-600 p-2 rounded-lg" },
            React.createElement(Heart, { className: "h-8 w-8 text-white" })
          ),
          React.createElement(
            "span",
            { className: "ml-3 text-2xl font-bold text-primary-900" },
            "HealthMitra"
          )
        ),
        // Tagline
        React.createElement(
          "h1",
          { className: "text-4xl font-bold text-gray-900 mb-4" },
          "Your Trusted Digital Health Companion"
        ),
        React.createElement(
          "p",
          { className: "text-lg text-gray-600 mb-8" },
          "Securely manage your medical records, get AI-powered health insights, ",
          "and never miss important medications or appointments."
        ),
        // Features
        React.createElement(
          "div",
          { className: "space-y-4" },
          React.createElement(
            "div",
            { className: "flex items-center" },
            React.createElement(Shield, {
              className: "h-5 w-5 text-primary-600 mr-3",
            }),
            React.createElement(
              "span",
              { className: "text-gray-700" },
              "Secure & Private Health Records"
            )
          ),
          React.createElement(
            "div",
            { className: "flex items-center" },
            React.createElement(Heart, {
              className: "h-5 w-5 text-primary-600 mr-3",
            }),
            React.createElement(
              "span",
              { className: "text-gray-700" },
              "AI-Powered Health Insights"
            )
          ),
          React.createElement(
            "div",
            { className: "flex items-center" },
            React.createElement(Users, {
              className: "h-5 w-5 text-primary-600 mr-3",
            }),
            React.createElement(
              "span",
              { className: "text-gray-700" },
              "Easy Sharing with Healthcare Providers"
            )
          )
        ),
        // Disclaimer
        React.createElement(
          "div",
          { className: "mt-8 p-4 bg-blue-50 rounded-lg" },
          React.createElement(
            "p",
            { className: "text-sm text-blue-800" },
            React.createElement("strong", null, "Disclaimer:"),
            " HealthMitra provides health information and AI suggestions for educational purposes only. Always consult qualified healthcare providers for medical decisions."
          )
        )
      )
    ),
    // Right Side - Auth Forms
    React.createElement(
      "div",
      { className: "flex-1 lg:flex-none lg:w-96 bg-white shadow-xl" },
      React.createElement(
        "div",
        { className: "flex flex-col justify-center min-h-screen px-8 py-12" },
        // Mobile Logo
        React.createElement(
          "div",
          { className: "lg:hidden flex items-center justify-center mb-8" },
          React.createElement(
            "div",
            { className: "bg-primary-600 p-2 rounded-lg" },
            React.createElement(Heart, { className: "h-6 w-6 text-white" })
          ),
          React.createElement(
            "span",
            { className: "ml-2 text-xl font-bold text-primary-900" },
            "HealthMitra"
          )
        ),
        React.createElement(Outlet)
      )
    )
  );
};

module.exports = AuthLayout;
