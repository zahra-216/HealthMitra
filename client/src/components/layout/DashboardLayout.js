// client/src/components/layout/DashboardLayout.js
const React = require("react");
const { useState } = React;
const { Outlet } = require("react-router-dom");
const Sidebar = require("./Sidebar");
const Header = require("./Header");

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return React.createElement(
    "div",
    { className: "h-screen flex overflow-hidden bg-gray-100" },
    // Sidebar
    React.createElement(Sidebar, {
      isOpen: sidebarOpen,
      onClose: () => setSidebarOpen(false),
    }),
    // Main Content
    React.createElement(
      "div",
      { className: "flex flex-col w-0 flex-1 overflow-hidden" },
      React.createElement(Header, {
        onMenuClick: () => setSidebarOpen(true),
      }),
      // Page Content
      React.createElement(
        "main",
        { className: "flex-1 relative overflow-y-auto focus:outline-none" },
        React.createElement(
          "div",
          { className: "py-6" },
          React.createElement(
            "div",
            { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
            React.createElement(Outlet)
          )
        )
      )
    )
  );
};

module.exports = DashboardLayout;
