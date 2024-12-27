import { Avatar, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth } from "./firebase";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import utility from "./Utility/utilityFunctions";

function Nav() {
  const location = useLocation();
  const [user, setUser] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar state
  const [pickupAnchorEl, setPickupAnchorEl] = useState(null); // Pickup dropdown state
  const [rateAnchorEl, setRateAnchorEl] = useState(null); // Rate dropdown state
  const [RoleBasedScreens, setRoleBasedScreens] = useState({});
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("LoginCredentials")));
    setRoleBasedScreens(utility.rolesPermissions());
  }, []);

  const handlePickupMenuOpen = (event) =>
    setPickupAnchorEl(event.currentTarget);
  const handlePickupMenuClose = () => setPickupAnchorEl(null);

  const handleRateMenuOpen = (event) => setRateAnchorEl(event.currentTarget);
  const handleRateMenuClose = () => setRateAnchorEl(null);

  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between bg-purple-400 p-4 shadow-md">
      {/* Desktop Navigation */}
      <div className="flex  container mx-auto justify-between">
        <div className="flex items-center gap-4">
          <Link to="/PickupBooking">
            <img src="/logo.png" className="h-10" alt="Logo" />
          </Link>
          <button
            className="lg:hidden block text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon fontSize="large" />
          </button>
          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex space-x-8 items-center">
            <li>
              <button
                onClick={handlePickupMenuOpen}
                className="text-white flex items-center gap-1"
              >
                Pickup Management
                <ArrowDropDownIcon />
              </button>
              <Menu
                anchorEl={pickupAnchorEl}
                open={Boolean(pickupAnchorEl)}
                onClose={handlePickupMenuClose}
              >
                {RoleBasedScreens?.PickupManagement?.map((d) => (
                  <MenuItem
                    onClick={handlePickupMenuClose}
                    component={Link}
                    to={`/${d}`}
                    className={`${
                      location.pathname === `/${d}`
                        ? "text-purple-900"
                        : "text-gray-700"
                    }`}
                  >
                    {utility.formatRouteName(d)}
                  </MenuItem>
                ))}
              </Menu>
            </li>
            <li>
              <button
                onClick={handleRateMenuOpen}
                className="text-white flex items-center gap-1"
              >
                Rate Management
                <ArrowDropDownIcon />
              </button>
              <Menu
                anchorEl={rateAnchorEl}
                open={Boolean(rateAnchorEl)}
                onClose={handleRateMenuClose}
              >
                {RoleBasedScreens?.RateManagement?.map((d) => (
                  <MenuItem
                    onClick={handlePickupMenuClose}
                    component={Link}
                    to={`/${d}`}
                    className={`${
                      location.pathname === `/${d}`
                        ? "text-purple-900"
                        : "text-gray-700"
                    }`}
                  >
                    {utility.formatRouteName(d)}
                  </MenuItem>
                ))}
              </Menu>
            </li>
            <li>
              <Link
                to="/Payment-confirm"
                className={`text-white ${
                  location.pathname === "/Payment-confirm"
                    ? "font-semibold"
                    : ""
                }`}
              >
                Payment Confirm
              </Link>
            </li>
            <li>
              <Link
                to="/Cancel-reschedule"
                className={`text-white ${
                  location.pathname === "/Cancel-reschedule"
                    ? "font-semibold"
                    : ""
                }`}
              >
                Cancel - Reschedule
              </Link>
            </li>
          </ul>
        </div>
        {/* Right Section */}
        <div className="flex items-center gap-6">
          <Avatar>{user?.name?.[0] || "?"}</Avatar>
          <div className="text-black hidden sm:block">
            {user ? (
              <>
                <p className="font-medium">{user.email}</p>
                <p>{user.name}</p>
              </>
            ) : (
              <p>Loading user info...</p> // Display loading text or spinner
            )}
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("LoginCredentials");
              auth.signOut();
            }}
            className="bg-white text-purple-700 font-semibold p-1 pl-4 pr-5 rounded-sm"
          >
            Logout
          </button>
        </div>
        {/* Sidebar for Mobile */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white z-20 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out shadow-lg`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-purple-500">
            <h2 className="text-white font-bold text-lg">Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white focus:outline-none hover:text-gray-200"
            >
              <CloseIcon />
            </button>
          </div>
          {/* Menu Items */}
          <ul className="flex flex-col p-4 space-y-2">
            {RoleBasedScreens?.PickupManagement?.map((d) => (
              <li>
                <Link
                  to={`/${d}`}
                  className={`py-2 px-4 text-gray-700 rounded-lg transition-colors duration-200 block ${
                    location.pathname === `/${d}`
                      ? "bg-purple-100 text-purple-800"
                      : ""
                  } hover:bg-purple-200`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {utility.formatRouteName(d)}
                </Link>
              </li>
            ))}
            {RoleBasedScreens?.RateManagement?.map((d) => (
              <li>
                <Link
                  to={`/${d}`}
                  className={`py-2 px-4 text-gray-700 rounded-lg transition-colors duration-200 block ${
                    location.pathname === `/${d}`
                      ? "bg-purple-100 text-purple-800"
                      : ""
                  } hover:bg-purple-200`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {utility.formatRouteName(d)}
                </Link>
              </li>
            ))}

            <li>
              <Link
                to="/Payment-confirm"
                className={`py-2 px-4 text-gray-700 rounded-lg transition-colors duration-200 block ${
                  location.pathname === "/Payment-confirm"
                    ? "bg-purple-100 text-purple-800"
                    : ""
                } hover:bg-purple-200`}
                onClick={() => setSidebarOpen(false)}
              >
                Payment Confirm
              </Link>
            </li>
            <li>
              <Link
                to="/Cancel-reschedule"
                className={`py-2 px-4 text-gray-700 rounded-lg transition-colors duration-200 block ${
                  location.pathname === "/Cancel-reschedule"
                    ? "bg-purple-100 text-purple-800"
                    : ""
                } hover:bg-purple-200`}
                onClick={() => setSidebarOpen(false)}
              >
                Cancel - Reschedule
              </Link>
            </li>
          </ul>
        </div>
        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-10"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
      </div>
    </nav>
  );
}
export default Nav;