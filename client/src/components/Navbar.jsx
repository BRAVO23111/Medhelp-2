import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'; // Import NavLink and useLocation
import { userState } from '../atoms/Doctoratom';
import { useRecoilValue } from 'recoil';
import toast, { Toaster } from 'react-hot-toast';


const Navbar = () => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const notify = () => toast("Logged out")
  useEffect(() => {
    const userRoleFromStorage = window.localStorage.getItem('userRole');
    const token = window.localStorage.getItem('token');
    setUserRole(userRoleFromStorage);
    setIsLoggedIn(!!userRoleFromStorage && !!token);
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem('userRole');
    window.localStorage.removeItem('userId');
    window.localStorage.removeItem('token');
    setUserRole('');
    setIsLoggedIn(false);
    navigate('/login');
    notify()
  };

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">
          <Link to='/' className="text-white">MedHelp</Link>
        </h1>
        <ul className="flex items-center">
          {!isLoggedIn && (
            <li>
              <Link to="/login" className="text-white hover:text-blue-200 px-4 py-2 rounded-lg">Login</Link>
            </li>
          )}
          {isLoggedIn && userRole === 'admin' && (
            <li>
              <NavLink to="/adddoctor" activeClassName="border-b-2 border-blue-400" className="text-white px-4 py-2 rounded-lg">Add Doctor</NavLink>
            </li>
          )}
          {isLoggedIn && userRole === 'patient' && (
            <React.Fragment>
              <li>
                <NavLink to="/bookappointment" activeClassName="border-b-2 border-blue-400" className={`text-white px-4 py-2 rounded-lg ${location.pathname === '/bookappointment' ? 'border-b-2 border-blue-400' : ''}`}>Book Appointment</NavLink>
              </li>
              <li>
                <NavLink to="/viewappointments" activeClassName="border-b-2 border-blue-400" className={`text-white px-4 py-2 rounded-lg ${location.pathname === '/viewappointments' ? 'border-b-2 border-blue-400' : ''}`}>My Appointments</NavLink>
              </li>
            </React.Fragment>
          )}
          {(isLoggedIn && (userRole === 'admin' || userRole === 'doctor')) && (
            <li>
              <NavLink to="/manage" activeClassName="border-b-2 border-blue-400" className={`text-white px-4 py-2 rounded-lg ${location.pathname === '/manage' ? 'border-b-2 border-blue-400' : ''}`}>Manage</NavLink>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button onClick={handleLogout} className="text-white bg-blue-700 hover:bg-blue-800 px-5 py-2 rounded-lg mx-4">Logout</button>
            </li>
          )}
          
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
