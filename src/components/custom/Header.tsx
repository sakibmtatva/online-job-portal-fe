import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { BellIcon, ChevronDown, LogOut, User, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import LogoutDialog from "./LogoutDialog";
import { useEffect, useState } from "react";
import NotificationCard from "../../pages/NotificationCard";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, profile_url } = useSelector((state: RootState) => state.auth);
  const role = useSelector(
    (state: RootState) => state.auth.currentUser?.user_type
  );
  const profilePicture = profile_url;
  const userName = useSelector(
    (state: RootState) => state.auth.currentUser?.full_name
  );
  const displayPicture =
    profilePicture || (userName ? `${userName.charAt(0)}` : "");
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleNewNotification = (event: CustomEvent) => {
      const isNotification = event.detail.notification.body;
      setHasUnreadNotifications(!!isNotification);
      if (showNotifications) {
        setShowNotifications(false);
      }
    };

    window.addEventListener(
      "newNotification",
      handleNewNotification as EventListener
    );

    return () => {
      window.removeEventListener(
        "newNotification",
        handleNewNotification as EventListener
      );
    };
  }, [showNotifications]);

  const navLinkClass = (isActive: boolean) =>
    isActive
      ? "font-medium text-blue-600"
      : "text-gray-600 hover:text-blue-600";

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDrawerOpen(false);
    }
  };

  const isActiveLink = (path: string) => location.pathname === path;

  return (
    <>
      <div className="w-full p-2 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {role === "Candidate" && (
            <button
              onClick={handleDrawerToggle}
              className="md:hidden flex items-center justify-center"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          )}
          <NavLink to="/" className="py-3 flex items-center gap-1">
            <img
              src={logo}
              alt="logo"
              width={40}
              height={40}
              className="w-auto h-auto"
            />
            <h2 className="text-2xl font-bold">Career Connect</h2>
          </NavLink>
        </div>
        <div className="hidden md:flex items-center gap-6">
          {(role === "Candidate" || !token) && (
            <NavLink
              to="/"
              className={({ isActive }) => navLinkClass(isActive)}
            >
              Home
            </NavLink>
          )}
          {(role === "Candidate" || !token) && (
            <NavLink
              to="/jobs"
              className={({ isActive }) => navLinkClass(isActive)}
            >
              Find Jobs
            </NavLink>
          )}
          {token && role === "Candidate" && (
            <NavLink
              to="/employerListing"
              className={({ isActive }) => navLinkClass(isActive)}
            >
              Companies
            </NavLink>
          )}
          {!token && (
            <NavLink
              to="/employerListing"
              className={({ isActive }) => navLinkClass(isActive)}
            >
              Companies
            </NavLink>
          )}
          {role === "Candidate" && token && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive || location.pathname === "/settings"
                  ? "font-medium text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }
            >
              Dashboard
            </NavLink>
          )}
        </div>
        <div className="flex gap-3 md:gap-5 items-center">
          {token ? (
            <>
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setHasUnreadNotifications(false);
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors relative"
                >
                  <BellIcon
                    className={`w-5 h-5 ${
                      hasUnreadNotifications ? "text-red-500" : "text-gray-600"
                    }`}
                  />
                  {hasUnreadNotifications && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 z-50">
                    <NotificationCard
                      onClose={() => setShowNotifications(false)}
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none flex items-center justify-between w-full">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-10 h-10 rounded-full cursor-pointer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-300 cursor-pointer hover:bg-gray-400 transition-colors">
                        <span className="text-lg font-bold">
                          {displayPicture}
                        </span>
                      </div>
                    )}
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-30">
                    <DropdownMenuItem
                      className="cursor-pointer flex items-center gap-2"
                      onClick={() => navigate("/settings")}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </DropdownMenuItem>
                    <LogoutDialog>
                      <div className="cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-600 mx-[10px] text-sm mb-1">
                        <LogOut className="w-4 h-4" />
                        <span className="text-black">Logout</span>
                      </div>
                    </LogoutDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <>
              <Button
                variant="default"
                className="h-10 md:h-12 p-[10px] md:p-[12px] px-[16px] md:px-[24px] border-blue-600 hover:border-blue-700 border-solid border text-blue-600 hover:text-blue-700 cursor-pointer"
                style={{ backgroundColor: "transparent" }}
                asChild
              >
                <NavLink to="/signin">Sign In</NavLink>
              </Button>

              <Button
                className="h-10 md:h-12 bg-blue-600 text-white hover:bg-blue-700 p-[10px] md:p-[12px] px-[16px] md:px-[24px] cursor-pointer"
                variant="default"
                asChild
              >
                <NavLink to="/post-job">Post A Job</NavLink>
              </Button>
            </>
          )}
        </div>
      </div>
      {isDrawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-opacity-30"
          onClick={closeDrawer}
        >
          <div
            className={`h-full w-2/4 max-w-xs bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
              isDrawerOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between bg-gray-100 items-center p-4">
              <NavLink to="/" className="flex items-center gap-1">
                <img src={logo} alt="logo" className="w-5 h-5" />
                <h2 className="text-lg font-bold">Career Connect</h2>
              </NavLink>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <NavLink
                to="/"
                className={`block py-2 px-4 ${
                  isActiveLink("/")
                    ? "bg-gray-100 transition-colors rounded-lg text-gray-600"
                    : ""
                }`}
                onClick={() => setIsDrawerOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/jobs"
                className={`block py-2 px-4 ${
                  isActiveLink("/jobs")
                    ? "bg-gray-100 transition-colors rounded-lg text-gray-600"
                    : ""
                }`}
                onClick={() => setIsDrawerOpen(false)}
              >
                Find Jobs
              </NavLink>
              <NavLink
                to="/employerListing"
                className={`block py-2 px-4 ${
                  isActiveLink("/employerListing")
                    ? "bg-gray-100 transition-colors rounded-lg text-gray-600"
                    : ""
                }`}
                onClick={() => setIsDrawerOpen(false)}
              >
                Companies
              </NavLink>
              {token && (
                <NavLink
                  to="/dashboard"
                  className={`block py-2 px-4 ${
                    isActiveLink("/dashboard")
                      ? "bg-gray-100 transition-colors rounded-lg text-gray-600"
                      : ""
                  }`}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Dashboard
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
