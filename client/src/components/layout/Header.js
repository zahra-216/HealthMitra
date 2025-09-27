// client/src/components/layout/Header.js
const React = require("react");
const { Bell, Menu, Search } = require("lucide-react");
const { useAppSelector, useAppDispatch } = require("@/hooks/redux");
const { logout } = require("@/store/slices/authSlice");
const Button = require("@/components/ui/Button");

const Header = ({ onMenuClick }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { unreadCount } = useAppSelector((state) => state.ai);

  const handleLogout = () => {
    dispatch(logout());
  };

  return React.createElement(
    "div",
    {
      className:
        "relative z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200",
    },
    React.createElement(
      "button",
      {
        className:
          "px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden",
        onClick: onMenuClick,
      },
      React.createElement(Menu, { className: "h-6 w-6" })
    ),
    React.createElement(
      "div",
      { className: "flex-1 px-4 flex justify-between items-center" },
      React.createElement(
        "div",
        { className: "flex-1 flex" },
        React.createElement(
          "div",
          {
            className:
              "w-full flex md:ml-0 relative text-gray-400 focus-within:text-gray-600",
          },
          React.createElement(
            "div",
            {
              className:
                "absolute inset-y-0 left-0 flex items-center pointer-events-none",
            },
            React.createElement(Search, { className: "h-5 w-5" })
          ),
          React.createElement("input", {
            id: "search-field",
            className:
              "block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent",
            placeholder: "Search health records...",
            type: "search",
          })
        )
      ),
      React.createElement(
        "div",
        { className: "ml-4 flex items-center md:ml-6" },
        // Notifications
        React.createElement(
          "button",
          {
            className:
              "relative bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
            "aria-label": "View notifications",
          },
          React.createElement(Bell, { className: "h-6 w-6" }),
          unreadCount > 0 &&
            React.createElement(
              "span",
              {
                className:
                  "absolute -top-1 -right-1 h-4 w-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center",
              },
              unreadCount > 9 ? "9+" : unreadCount
            )
        ),
        // Profile dropdown
        React.createElement(
          "div",
          { className: "ml-3 relative" },
          React.createElement(
            "div",
            { className: "flex items-center" },
            React.createElement(
              "div",
              { className: "flex items-center" },
              React.createElement("img", {
                className:
                  "h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center",
                src: `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=0ea5e9&color=fff`,
                alt: `${user?.firstName} ${user?.lastName}`,
              }),
              React.createElement(
                "div",
                { className: "ml-3" },
                React.createElement(
                  "p",
                  {
                    className:
                      "text-sm font-medium text-gray-700 group-hover:text-gray-900",
                  },
                  `${user?.firstName} ${user?.lastName}`
                ),
                React.createElement(
                  "p",
                  {
                    className:
                      "text-xs font-medium text-gray-500 group-hover:text-gray-700",
                  },
                  user?.role
                )
              )
            ),
            React.createElement(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: handleLogout,
                className: "ml-3",
              },
              "Logout"
            )
          )
        )
      )
    )
  );
};

module.exports = Header;
