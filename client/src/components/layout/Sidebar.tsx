// client/src/components/layout/Sidebar.tsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Heart,
  LayoutDashboard,
  FileText,
  Brain,
  Bell,
  User,
  X,
  Plus,
} from "lucide-react";
import { clsx } from "clsx";
import { useAppSelector } from "@/hooks/redux";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const { unreadCount } = useAppSelector((state) => state.ai);

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Health Records",
      href: "/health-records",
      icon: FileText,
    },
    {
      name: "Add Record",
      href: "/health-records/new",
      icon: Plus,
    },
    {
      name: "AI Insights",
      href: "/ai-insights",
      icon: Brain,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      name: "Reminders",
      href: "/reminders",
      icon: Bell,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={onClose}
          />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          "fixed inset-y-0 left-0 flex flex-col w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold text-primary-900">
              HealthMitra
            </span>
          </div>
          <button
            className="lg:hidden p-1 text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <img
              className="h-10 w-10 rounded-full"
              src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=0ea5e9&color=fff`}
              alt={`${user?.firstName} ${user?.lastName}`}
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  clsx(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary-100 text-primary-900 border-r-2 border-primary-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )
                }
                onClick={() => onClose()}
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="ml-3 inline-block py-0.5 px-2 text-xs bg-danger-100 text-danger-800 rounded-full">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p className="mb-1">HealthMitra v1.0.0</p>
            <p>by DataBuddies LK</p>
            <div className="mt-2 p-2 bg-yellow-50 rounded text-yellow-700">
              <p className="text-xs">
                <strong>⚠️ Disclaimer:</strong> AI suggestions are for
                educational purposes only. Always consult healthcare providers
                for medical decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
