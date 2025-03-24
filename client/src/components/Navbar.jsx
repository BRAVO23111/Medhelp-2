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
  FaChevronDown
} from "react-icons/fa";
import { MdLogin } from "react-icons/md";
import { userState } from "../atoms/Doctoratom";
import { Button } from "./ui/button";
import { FadeMenu, FadeMenuItem } from "./ui/fade-menu";

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
        `flex items-center px-4 py-2 transition-colors duration-300
        ${isActive ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}`
      }
      onClick={closeMenu}
    >
      <Icon className="mr-2" /> {children}
    </NavLink>
  );

  return (
    <nav className="bg-white shadow-sm py-3 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-full relative">
          <div className="flex items-center w-1/4">
            <Link to="/" className="flex-shrink-0 flex items-center mr-6">
              <span className="text-xl font-bold text-blue-600">MedHelp</span>
            </Link>
            <div className="hidden md:flex md:items-center md:justify-center md:space-x-4 absolute left-1/2 transform -translate-x-1/2">
              <NavLink to="/" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2">Home</NavLink>
              <NavLink to="/features" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2">Features</NavLink>
              <NavLink to="/testimonials" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2">Testimonials</NavLink>
              <NavLink to="/faq" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2">FAQ</NavLink>
              <NavLink to="/contact" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2">Contact</NavLink>
            </div>
          </div>
            
          <div className="hidden md:flex md:items-center">
            {!user.isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <NavLink to="/login" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 flex items-center">
                  <MdLogin className="mr-2" /> Login
                </NavLink>
                <Button 
                  onClick={() => navigate('/register')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-4 py-2"
                >
                  Sign Up
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {user.userRole === "admin" && <NavItem to="/adddoctor" icon={FaUserPlus}>Add Doctor</NavItem>}
                {user.userRole === "patient" && (
                  <>
                    <NavItem to="/bookappointment" icon={FaCalendarAlt}>Doctors</NavItem>
                    <FadeMenu 
                      trigger={
                        <div className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 font-medium cursor-pointer">
                          <FaUser className="mr-2" /> 
                          Profile
                          <FaChevronDown className="ml-2 h-4 w-4" />
                        </div>
                      }
                      align="left"
                      menuClassName="w-full max-w-[200px]"
                    >
                      <FadeMenuItem onClick={() => { navigate('/profile'); closeMenu(); }}>
                        Profile Settings
                      </FadeMenuItem>
                      <FadeMenuItem onClick={() => { navigate('/viewappointments'); closeMenu(); }}>
                        My Appointments
                      </FadeMenuItem>
                      <FadeMenuItem onClick={() => { navigate('/prescriptions'); closeMenu(); }}>
                        Prescriptions
                      </FadeMenuItem>
                    </FadeMenu>
                  </>
                )}
                {(user.userRole === "admin" || user.userRole === "doctor") && (
                  <NavItem to="/manage" icon={FaUserMd}>Manage</NavItem>
                )}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {menuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden mt-2 border-t border-gray-100 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-md hover:bg-gray-50">Home</NavLink>
            <NavLink to="/features" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-md hover:bg-gray-50">Features</NavLink>
            <NavLink to="/how-it-works" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-md hover:bg-gray-50">How It Works</NavLink>
            <NavLink to="/bookappointment" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-md hover:bg-gray-50">Doctors</NavLink>
            <NavLink to="/testimonials" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-md hover:bg-gray-50">Testimonials</NavLink>
            <NavLink to="/faq" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-md hover:bg-gray-50">FAQ</NavLink>
            <NavLink to="/contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-md hover:bg-gray-50">Contact</NavLink>
            
            {!user.isLoggedIn ? (
              <div className="space-y-2 pt-2">
                <NavLink to="/login" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-md hover:bg-gray-50">
                  <div className="flex items-center w-1/4">
                    <MdLogin className="mr-2" /> Login
                  </div>
                </NavLink>
                <Button 
                  onClick={() => navigate('/register')} 
                  className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-4 py-2"
                >
                  Sign Up
                </Button>
              </div>
            ) : (
              <div className="space-y-1 pt-2 border-t border-gray-100 mt-2">
                {user.userRole === "admin" && <NavItem to="/adddoctor" icon={FaUserPlus}>Add Doctor</NavItem>}
                {user.userRole === "patient" && (
                  <>
                    <NavItem to="/bookappointment" icon={FaCalendarAlt}>Book Appointment</NavItem>
                    <FadeMenu 
                      trigger={
                        <div className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 font-medium cursor-pointer">
                          <FaUser className="mr-2" /> 
                          Profile
                          <FaChevronDown className="ml-2 h-4 w-4" />
                        </div>
                      }
                      align="left"
                      menuClassName="w-full max-w-[200px]"
                    >
                      <FadeMenuItem onClick={() => { navigate('/profile'); closeMenu(); }}>
                        Profile Settings
                      </FadeMenuItem>
                      <FadeMenuItem onClick={() => { navigate('/viewappointments'); closeMenu(); }}>
                        My Appointments
                      </FadeMenuItem>
                      <FadeMenuItem onClick={() => { navigate('/prescriptions'); closeMenu(); }}>
                        Prescriptions
                      </FadeMenuItem>
                    </FadeMenu>
                  </>
                )}
                {(user.userRole === "admin" || user.userRole === "doctor") && (
                  <NavItem to="/manage" icon={FaUserMd}>Manage</NavItem>
                )}
                <Button
                  onClick={() => { handleLogout(); closeMenu(); }}
                  variant="outline"
                  className="mt-3 w-full flex items-center justify-center text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      <Toaster />
    </nav>
  );
};

export default Navbar;