import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import toast, { Toaster } from 'react-hot-toast';
import { FaUserMd, FaCalendarAlt, FaSignOutAlt, FaUserPlus, FaHome, FaBars, FaTimes } from 'react-icons/fa';
import { MdLogin } from 'react-icons/md';
import { userState } from '../atoms/Doctoratom';

const Navbar = () => {
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();
  const location = useLocation();
  const notify = () => toast("Logged out");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const userRoleFromStorage = window.localStorage.getItem('userRole');
    const token = window.localStorage.getItem('token');
    if (userRoleFromStorage && token) {
      setUser({
        isLoggedIn: true,
        userRole: userRoleFromStorage,
      });
    }

    const handleStorageChange = () => {
      const updatedUserRole = window.localStorage.getItem('userRole');
      const updatedToken = window.localStorage.getItem('token');
      setUser({
        isLoggedIn: !!updatedUserRole && !!updatedToken,
        userRole: updatedUserRole || '',
      });
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setUser]);

  const handleLogout = () => {
    window.localStorage.removeItem('userRole');
    window.localStorage.removeItem('userId');
    window.localStorage.removeItem('token');
    setUser({
      isLoggedIn: false,
      userRole: '',
    });
    navigate('/login');
    notify();
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to='/' className="text-white text-2xl font-bold flex items-center">
          <FaHome className="mr-2" /> MedHelp
        </Link>
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-white text-2xl focus:outline-none">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <ul className={`lg:flex items-center space-x-4 ${menuOpen ? 'block' : 'hidden'} lg:block`}>
          {!user.isLoggedIn && (
            <li>
              <Link to="/login" className="text-white flex items-center hover:text-gray-200 px-4 py-2 rounded-lg" onClick={closeMenu}>
                <MdLogin className="mr-2" /> Login
              </Link>
            </li>
          )}
          {user.isLoggedIn && user.userRole === 'admin' && (
            <li>
              <NavLink to="/adddoctor" activeClassName="text-blue-800" className="text-white flex items-center px-4 py-2 rounded-lg" onClick={closeMenu}>
                <FaUserPlus className="mr-2" /> Add Doctor
              </NavLink>
            </li>
          )}
          {user.isLoggedIn && user.userRole === 'patient' && (
            <>
              <li>
                <NavLink to="/bookappointment" activeClassName="text-blue-800" className={`text-white flex items-center px-4 py-2 rounded-lg ${location.pathname === '/bookappointment' ? 'text-blue-800' : ''}`} onClick={closeMenu}>
                  <FaCalendarAlt className="mr-2" /> Book Appointment
                </NavLink>
              </li>
              <li>
                <NavLink to="/viewappointments" activeClassName="text-blue-800" className={`text-white flex items-center px-4 py-2 rounded-lg ${location.pathname === '/viewappointments' ? 'text-blue-800' : ''}`} onClick={closeMenu}>
                  <FaCalendarAlt className="mr-2" /> My Appointments
                </NavLink>
              </li>
            </>
          )}
          {(user.isLoggedIn && (user.userRole === 'admin' || user.userRole === 'doctor')) && (
            <li>
              <NavLink to="/manage" activeClassName="text-blue-800" className={`text-white flex items-center px-4 py-2 rounded-lg ${location.pathname === '/manage' ? 'text-blue-800' : ''}`} onClick={closeMenu}>
                <FaUserMd className="mr-2" /> Manage
              </NavLink>
            </li>
          )}
          {user.isLoggedIn && (
            <li>
              <button onClick={() => { handleLogout(); closeMenu(); }} className="text-white flex items-center bg-blue-700 hover:bg-blue-800 px-5 py-2 rounded-lg mx-4">
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </li>
          )}
        </ul>
      </div>
      <Toaster />
    </nav>
  );
};

export default Navbar;
