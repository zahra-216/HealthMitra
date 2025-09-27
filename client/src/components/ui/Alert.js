// client/src/components/ui/Alert.js
const React = require("react");
const {
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
} = require("lucide-react");
const { clsx } = require("clsx");

const Alert = ({ variant = "info", title, children, className }) => {
  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
  };

  const variantClasses = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800",
  };

  const iconClasses = {
    info: "text-blue-400",
    success: "text-green-400",
    warning: "text-yellow-400",
    error: "text-red-400",
  };

  const Icon = icons[variant];

  return React.createElement(
    "div",
    {
      className: clsx(
        "rounded-md border p-4",
        variantClasses[variant],
        className
      ),
    },
    React.createElement(
      "div",
      { className: "flex" },
      React.createElement(Icon, {
        className: clsx("h-5 w-5 mt-0.5", iconClasses[variant]),
      }),
      React.createElement(
        "div",
        { className: "ml-3" },
        title &&
          React.createElement(
            "h3",
            { className: "text-sm font-medium mb-1" },
            title
          ),
        React.createElement("div", { className: "text-sm" }, children)
      )
    )
  );
};

module.exports = Alert;
