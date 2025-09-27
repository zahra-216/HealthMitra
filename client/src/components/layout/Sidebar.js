// client/src/components/layout/Sidebar.js
const React = require("react");
const { NavLink, useLocation } = require("react-router-dom");
const {
  Heart,
  LayoutDashboard,
  FileText,
  Brain,
  Bell,
  User,
  X,
  Plus,
} = require("lucide-react");
const clsx = require("clsx");
const { useAppSelector } = require("@/hooks/redux");

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const { unreadCount } = useAppSelector((state) => state.ai);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Health Records", href: "/health-records", icon: FileText },
    { name: "Add Record", href: "/health-records/new", icon: Plus },
    {
      name: "AI Insights",
      href: "/ai-insights",
      icon: Brain,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { name: "Reminders", href: "/reminders", icon: Bell },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return React.createElement(
    React.Fragment,
    null,
    // Mobile backdrop
    isOpen &&
      React.createElement(
        "div",
        { className: "fixed inset-0 flex z-40 lg:hidden" },
        React.createElement("div", {
          className: "fixed inset-0 bg-gray-600 bg-opacity-75",
          onClick: onClose,
        })
      ),
    // Sidebar
    React.createElement(
      "div",
      {
        className: clsx(
          "fixed inset-y-0 left-0 flex flex-col w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        ),
      },
      // Header
      React.createElement(
        "div",
        {
          className:
            "flex items-center justify-between h-16 px-6 border-b border-gray-200",
        },
        React.createElement(
          "div",
          { className: "flex items-center" },
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
        React.createElement(
          "button",
          {
            className: "lg:hidden p-1 text-gray-400 hover:text-gray-500",
            onClick: onClose,
          },
          React.createElement(X, { className: "h-6 w-6" })
        )
      ),
      // User info
      React.createElement(
        "div",
        { className: "px-6 py-4 border-b border-gray-200" },
        React.createElement(
          "div",
          { className: "flex items-center" },
          React.createElement("img", {
            className: "h-10 w-10 rounded-full",
            src: `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=0ea5e9&color=fff`,
            alt: `${user?.firstName} ${user?.lastName}`,
          }),
          React.createElement(
            "div",
            { className: "ml-3" },
            React.createElement(
              "p",
              { className: "text-sm font-medium text-gray-900" },
              `${user?.firstName} ${user?.lastName}`
            ),
            React.createElement(
              "p",
              { className: "text-xs text-gray-500 capitalize" },
              user?.role
            )
          )
        )
      ),
      // Navigation
      React.createElement(
        "nav",
        { className: "flex-1 px-4 py-4 space-y-1 overflow-y-auto" },
        navigation.map((item) => {
          const Icon = item.icon;
          return React.createElement(
            NavLink,
            {
              key: item.name,
              to: item.href,
              className: ({ isActive }) =>
                clsx(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary-100 text-primary-900 border-r-2 border-primary-500"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                ),
              onClick: onClose,
            },
            React.createElement(Icon, {
              className: "mr-3 h-5 w-5 flex-shrink-0",
            }),
            React.createElement("span", { className: "flex-1" }, item.name),
            item.badge &&
              React.createElement(
                "span",
                {
                  className:
                    "ml-3 inline-block py-0.5 px-2 text-xs bg-danger-100 text-danger-800 rounded-full",
                },
                item.badge > 99 ? "99+" : item.badge
              )
          );
        })
      ),
      // Footer
      React.createElement(
        "div",
        { className: "px-6 py-4 border-t border-gray-200" },
        React.createElement(
          "div",
          { className: "text-xs text-gray-500 text-center" },
          React.createElement("p", { className: "mb-1" }, "HealthMitra v1.0.0"),
          React.createElement("p", null, "by DataBuddies LK"),
          React.createElement(
            "div",
            { className: "mt-2 p-2 bg-yellow-50 rounded text-yellow-700" },
            React.createElement(
              "p",
              { className: "text-xs" },
              React.createElement("strong", null, "⚠️ Disclaimer:"),
              " AI suggestions are for educational purposes only. Always consult healthcare providers for medical decisions."
            )
          )
        )
      )
    )
  );
};

module.exports = Sidebar;
