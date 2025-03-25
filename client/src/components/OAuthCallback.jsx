import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userState } from '../atoms/Doctoratom';
import toast, { Toaster } from 'react-hot-toast';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setUserData = useSetRecoilState(userState);
  const notify = () => toast.success('Logged in successfully with Google');

  useEffect(() => {
    const handleOAuthCallback = () => {
      try {
        // Parse query parameters from the URL
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userId = params.get('userId');
        const role = params.get('role');
        const error = params.get('error');

        if (error) {
          toast.error('Authentication failed. Please try again.');
          navigate('/login');
          return;
        }

        if (!token || !userId || !role) {
          toast.error('Invalid authentication response. Please try again.');
          navigate('/login');
          return;
        }

        // Store authentication data in localStorage
        window.localStorage.setItem('token', token);
        window.localStorage.setItem('userId', userId);
        window.localStorage.setItem('userRole', role);
        
        // Update Recoil state
        setUserData({
          isLoggedIn: true,
          id: userId,
          token: token,
          userRole: role,
        });

        notify();

        // Redirect based on user role
        switch (role) {
          case 'admin':
            navigate('/manage');
            break;
          case 'patient':
            navigate('/profile');
            break;
          case 'doctor':
            navigate('/doctordashboard');
            break;
          default:
            navigate('/');
            break;
        }
      } catch (error) {
        console.error('Error processing OAuth callback:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      }
    };

    handleOAuthCallback();
  }, [location, navigate, setUserData]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Processing Authentication</h2>
        <p className="text-gray-600 mb-4">Please wait while we complete your sign-in...</p>
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
        <Toaster />
      </div>
    </div>
  );
};

export default OAuthCallback;