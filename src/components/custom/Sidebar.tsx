import {
  Settings,
  LogOut,
  Home,
  CirclePlus,
  BriefcaseBusiness,
  Users,
  Bookmark,
  Headset,
  Crown
} from "lucide-react";
import { NavLink } from "react-router-dom";
import LogoutDialog from "./LogoutDialog";

interface SidebarProps {
  role?: string;
}

const Sidebar = ({ role }: SidebarProps) => {
  const menuItems = [
    {
      icon: <Home />,
      label: "Overview",
      path: "/dashboard",
    },
    ...(role === "Employer"
      ? [
          {
            icon: <CirclePlus />,
            label: "Post A Job",
            path: "/postjob",
          },
          {
            icon: <BriefcaseBusiness />,
            label: "My Jobs",
            path: "/myjobs",
          },
          {
            icon: <Users />,
            label: "Candidates",
            path: "/candidateListing",
          },
          {
            icon: <Bookmark />,
            label: "Saved Candidates",
            path: "/bookmarkedCandidates",
          },
          {
            icon: <Crown />,
            label: "Subscriptions",
            path: "/subscriptions",
          },
          {
            icon: <Headset />,
            label: "Scheduled Meetings",
            path: "/meetings",
          },
        ]
      : []),
    ...(role === "Candidate"
      ? [
          {
            icon: <BriefcaseBusiness />,
            label: "Applied Jobs",
            path: "/appliedjobs",
          },
          {
            icon: <Bookmark />,
            label: "Favorite Jobs",
            path: "/bookmarkedjobs",
          },
          {
            icon: <Headset />,
            label: "Scheduled Meetings",
            path: "/meetings",
          },
        ]
      : []),
    {
      icon: <Settings />,
      label: "Settings",
      path: "/settings",
    },
  ];

  return (
    <aside className="bg-white  sticky top-0 sm:w-64 border-r border-gray-200">
      <div className="h-16 hidden sm:flex justify-center items-center px-2 md:px-6 border-b border-gray-200">
        <span className="md:text-sm font-medium text-gray-500 text-xs">
          {role?.toUpperCase()} DASHBOARD
        </span>
      </div>

      <nav className="flex flex-col h-[calc(100%-4rem)]">
        <ul className="space-y-1 p-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 text-gray-600 rounded-lg transition-colors ${
                    isActive ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                  }`
                }
              >
                <div className="flex items-center sm:gap-3">
                  <span className="text-gray-500">{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="py-0 px-2">
          <LogoutDialog>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
              <LogOut className="text-gray-500" />
              <span className="font-medium hidden sm:inline">Log-out</span>
            </button>
          </LogoutDialog>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
