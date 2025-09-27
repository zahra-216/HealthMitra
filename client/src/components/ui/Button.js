const React = require("react");
const { Loader2 } = require("lucide-react");
const { clsx } = require("clsx");

const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variantClasses = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300",
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100",
    ghost: "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
    danger: "bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800",
  };
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return React.createElement(
    "button",
    {
      className: clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      ),
      disabled: disabled || loading,
      ...props,
    },
    loading &&
      React.createElement(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
    children
  );
};

module.exports = Button;
