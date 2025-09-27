const React = require("react");
const { clsx } = require("clsx");

const Tabs = ({ tabs, defaultTab, className }) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0]?.id);

  return React.createElement(
    "div",
    { className: clsx("w-full", className) },
    React.createElement(
      "div",
      { className: "border-b border-gray-200" },
      React.createElement(
        "nav",
        { className: "-mb-px flex space-x-8" },
        tabs.map((tab) =>
          React.createElement(
            "button",
            {
              key: tab.id,
              onClick: () => setActiveTab(tab.id),
              className: clsx(
                "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              ),
            },
            tab.label
          )
        )
      )
    ),
    React.createElement(
      "div",
      { className: "mt-6" },
      tabs.find((t) => t.id === activeTab)?.content
    )
  );
};

module.exports = Tabs;
