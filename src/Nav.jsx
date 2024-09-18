import { Avatar } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { json, Link, useLocation } from "react-router-dom";
import { auth } from "./firebase";

function Nav() {
  const location = useLocation();
  const [user, setuser] = useState({});
  useEffect(() => {
    setuser(JSON.parse(localStorage.getItem("enquiryAuthToken")));
  }, []);
  return (
    <nav className="sticky flex items-center justify-around top-0 bg-purple-400 p-4 shadow-md z-10">
      <div className="flex gap-20 items-center">
        <img src="/logo.png" style={{ height: 40 }} alt="Logo" />

        <ul className="flex space-x-8 gap-10 items-center">
          <li>
            <Link
              to="/"
              className={`text-white rounded transition-colors ${
                location.pathname === "/PickupBooking" ||  location.pathname === "/"
                  ? "text-purple-900 font-semibold"
                  : "bg-transparent"
              }`}
              style={{ minHeight: "40px" }} // Ensures a fixed height
            >
              PickupBooking
            </Link>
          </li>
          <li>
            <Link
              to="/Sale-rates"
              className={`text-white  rounded transition-colors ${
                location.pathname === "/Sale-rates"
                  ? "text-purple-900 font-semibold"
                  : "bg-transparent"
              }`}
              style={{ minHeight: "40px" }} // Ensures a fixed height
            >
              SalesRate
            </Link>
          </li>
          <li>
            <Link
              to="/Payment-confirm"
              className={`text-white  rounded transition-colors ${
                location.pathname === "/Payment-confirm"
                  ? "text-purple-900 font-semibold"
                  : "bg-transparent"
              }`}
              style={{ minHeight: "40px" }} // Ensures a fixed height
            >
              Payment Confirm
            </Link>
          </li>
          <li>
            <Link
              to="/Cancel-reschedule"
              className={`text-white  rounded transition-colors ${
                location.pathname === "/Cancel-reschedule"
                  ? "text-purple-900 font-semibold"
                  : "bg-transparent"
              }`}
              style={{ minHeight: "40px" }} // Ensures a fixed height
            >
              Cancel - Reschedule
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex gap-6 items-center ">
        <div className="flex  gap-3 items-center">
        <Avatar >{user?.name?.slice(0,1)}</Avatar>
        <div className="text-black">
          <p className="font-medium">{user?.email}</p>
          <p>{user?.name}</p>
        </div>
        </div>
        <div
        onClick={() => {
          localStorage.removeItem("enquiryAuthToken");
          auth.signOut();
        }}
        className="bg-white text-purple-700 font-semibold p-1 pl-4  pr-5 cursor-pointer rounded-sm"
      >
        Logout
      </div>
      </div>
     
    </nav>
  );
}

export default Nav;