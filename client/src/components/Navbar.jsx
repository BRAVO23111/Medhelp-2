import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = window.localStorage.getItem("userId");
    const role = window.localStorage.getItem("userRole");
    setIsLoggedIn(!!userId);
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("userId");
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("userRole");
    setIsLoggedIn(false); // Update isLoggedIn state
    navigate('/login');
  };

  const handleHomeClick = () => {
    if (!isLoggedIn) {
      alert("Please login to view.");
      navigate('/login')
    }
  };

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold"><Link to='/'>MedHelp</Link></h1>
        <ul className="flex items-center">
          <li>
            <Link to="/" className="text-white mr-4 hover:text-blue-200" onClick={handleHomeClick}>Home</Link>
          </li>
          {!isLoggedIn && (
            <li>
              <Link to="/login" className="text-white mr-4 hover:text-blue-200">Login</Link>
            </li>
          )}
          {userRole === 'admin' && (
            <li>
              <Link to="/adddoctor" className="text-white mr-4 hover:text-blue-200">Add Doctor</Link>
            </li>
          )}
          {userRole === 'patient' && (
            <li>
              <Link to="/viewappointments" className="text-white mr-4 hover:text-blue-200">Appointments</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button onClick={handleLogout} className="text-white mr-4 hover:text-blue-200">Logout</button>
            </li>
          )}
          {( userRole === 'admin') && ( // Show the "Manage" button for doctors and admins
            <li>
              <Link to="/manage" className="text-white mr-4 hover:text-blue-200">Manage</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
