import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import toast, { Toaster } from "react-hot-toast";
import {
  FaUserMd,
  FaCalendarAlt,
  FaSignOutAlt,
  FaUserPlus,
  FaHome,
  FaBars,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { MdLogin } from "react-icons/md";
import { userState } from "../atoms/Doctoratom";

const Navbar = () => {
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const userRoleFromStorage = window.localStorage.getItem("userRole");
    const token = window.localStorage.getItem("token");
    if (userRoleFromStorage && token) {
      setUser({ isLoggedIn: true, userRole: userRoleFromStorage });
    }
  }, [setUser]);

  const handleLogout = () => {
    ["userRole", "userId", "token", "profile"].forEach(item => 
      window.localStorage.removeItem(item)
    );
    setUser({ isLoggedIn: false, userRole: "" });
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const NavItem = ({ to, icon: Icon, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 rounded-md transition-colors duration-300
        ${isActive ? 'text-blue-600 bg-blue-100' : 'text-gray-700 hover:bg-gray-100'}`
      }
      onClick={closeMenu}
    >
      <Icon className="mr-2" /> {children}
    </NavLink>
  );

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <FaHome className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">MedHelp</span>
            </Link>
          </div>
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {!user.isLoggedIn && <NavItem to="/login" icon={MdLogin}>Login</NavItem>}
            {user.isLoggedIn && (
              <>
                {user.userRole === "admin" && <NavItem to="/adddoctor" icon={FaUserPlus}>Add Doctor</NavItem>}
                {user.userRole === "patient" && (
                  <>
                    <NavItem to="/bookappointment" icon={FaCalendarAlt}>Book Appointment</NavItem>
                    <NavItem to="/viewappointments" icon={FaCalendarAlt}>My Appointments</NavItem>
                    <NavItem to="/profile" icon={FaUser}>Profile</NavItem>
                  </>
                )}
                {(user.userRole === "admin" || user.userRole === "doctor") && (
                  <NavItem to="/manage" icon={FaUserMd}>Manage</NavItem>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {menuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!user.isLoggedIn && <NavItem to="/login" icon={MdLogin}>Login</NavItem>}
            {user.isLoggedIn && (
              <>
                {user.userRole === "admin" && <NavItem to="/adddoctor" icon={FaUserPlus}>Add Doctor</NavItem>}
                {user.userRole === "patient" && (
                  <>
                    <NavItem to="/bookappointment" icon={FaCalendarAlt}>Book Appointment</NavItem>
                    <NavItem to="/viewappointments" icon={FaCalendarAlt}>My Appointments</NavItem>
                    <NavItem to="/profile" icon={FaUser}>Profile</NavItem>
                  </>
                )}
                {(user.userRole === "admin" || user.userRole === "doctor") && (
                  <NavItem to="/manage" icon={FaUserMd}>Manage</NavItem>
                )}
                <button
                  onClick={() => { handleLogout(); closeMenu(); }}
                  className="w-full flex items-center px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <Toaster />
    </nav>
  );
};

export default Navbar;