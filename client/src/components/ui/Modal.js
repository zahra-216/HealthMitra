const React = require("react");
const { X } = require("lucide-react");
const { clsx } = require("clsx");

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return React.createElement(
    "div",
    { className: "fixed inset-0 z-50 flex items-center justify-center" },
    React.createElement("div", {
      className: "absolute inset-0 bg-black bg-opacity-50 transition-opacity",
      onClick: onClose,
    }),
    React.createElement(
      "div",
      {
        className: clsx(
          "relative bg-white rounded-lg shadow-xl m-4 w-full transition-transform",
          sizeClasses[size],
          className
        ),
      },
      title &&
        React.createElement(
          "div",
          {
            className:
              "flex items-center justify-between p-6 border-b border-gray-200",
          },
          React.createElement(
            "h2",
            { className: "text-xl font-semibold text-gray-900" },
            title
          ),
          React.createElement(
            "button",
            {
              onClick: onClose,
              className:
                "p-1 text-gray-400 hover:text-gray-600 transition-colors",
            },
            React.createElement(X, { className: "h-5 w-5" })
          )
        ),
      React.createElement("div", { className: "p-6" }, children)
    )
  );
};

module.exports = Modal;
