const React = require("react");
const { clsx } = require("clsx");

const Input = React.forwardRef(
  ({ label, error, helperText, className, ...props }, ref) => {
    return React.createElement(
      "div",
      { className: "w-full" },
      label &&
        React.createElement(
          "label",
          { className: "block text-sm font-medium text-gray-700 mb-1" },
          label,
          props.required &&
            React.createElement(
              "span",
              { className: "text-danger-500 ml-1" },
              "*"
            )
        ),
      React.createElement("input", {
        ref,
        className: clsx(
          "input",
          error && "border-danger-300 focus:ring-danger-500",
          className
        ),
        ...props,
      }),
      error &&
        React.createElement(
          "p",
          { className: "mt-1 text-sm text-danger-600" },
          error
        ),
      helperText &&
        !error &&
        React.createElement(
          "p",
          { className: "mt-1 text-sm text-gray-500" },
          helperText
        )
    );
  }
);
Input.displayName = "Input";

const Textarea = React.forwardRef(
  ({ label, error, helperText, className, ...props }, ref) => {
    return React.createElement(
      "div",
      { className: "w-full" },
      label &&
        React.createElement(
          "label",
          { className: "block text-sm font-medium text-gray-700 mb-1" },
          label,
          props.required &&
            React.createElement(
              "span",
              { className: "text-danger-500 ml-1" },
              "*"
            )
        ),
      React.createElement("textarea", {
        ref,
        className: clsx(
          "textarea",
          error && "border-danger-300 focus:ring-danger-500",
          className
        ),
        ...props,
      }),
      error &&
        React.createElement(
          "p",
          { className: "mt-1 text-sm text-danger-600" },
          error
        ),
      helperText &&
        !error &&
        React.createElement(
          "p",
          { className: "mt-1 text-sm text-gray-500" },
          helperText
        )
    );
  }
);
Textarea.displayName = "Textarea";

const Select = React.forwardRef(
  (
    { label, error, helperText, options, placeholder, className, ...props },
    ref
  ) => {
    const { ChevronDown } = require("lucide-react");
    return React.createElement(
      "div",
      { className: "w-full" },
      label &&
        React.createElement(
          "label",
          { className: "block text-sm font-medium text-gray-700 mb-1" },
          label,
          props.required &&
            React.createElement(
              "span",
              { className: "text-danger-500 ml-1" },
              "*"
            )
        ),
      React.createElement(
        "div",
        { className: "relative" },
        React.createElement(
          "select",
          {
            ref,
            className: clsx(
              "input appearance-none",
              error && "border-danger-300 focus:ring-danger-500",
              className
            ),
            ...props,
          },
          placeholder &&
            React.createElement(
              "option",
              { value: "", disabled: true },
              placeholder
            ),
          options.map((o) =>
            React.createElement(
              "option",
              { key: o.value, value: o.value, disabled: o.disabled },
              o.label
            )
          )
        ),
        React.createElement(ChevronDown, {
          className:
            "absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none",
        })
      ),
      error &&
        React.createElement(
          "p",
          { className: "mt-1 text-sm text-danger-600" },
          error
        ),
      helperText &&
        !error &&
        React.createElement(
          "p",
          { className: "mt-1 text-sm text-gray-500" },
          helperText
        )
    );
  }
);
Select.displayName = "Select";

module.exports = { Input, Textarea, Select };
