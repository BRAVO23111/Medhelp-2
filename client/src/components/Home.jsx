import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';

const HomePage = () => {
  const navigate = useNavigate();

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  const slideInLeft = useSpring({
    opacity: 1,
    transform: 'translateX(0)',
    from: { opacity: 0, transform: 'translateX(-100px)' },
    config: { duration: 1000 },
  });

  const slideInRight = useSpring({
    opacity: 1,
    transform: 'translateX(0)',
    from: { opacity: 0, transform: 'translateX(100px)' },
    config: { duration: 1000 },
  });

  const handleGetStartedClick = () => {
    const userId = window.localStorage.getItem('userId');
    if (userId) {
      navigate('/bookappointment');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <animated.div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 p-4 shadow-lg text-white text-center py-20" style={fadeIn}>
        <h1 className="text-5xl font-bold mb-4">Welcome to MedHelp</h1>
        <p className="text-lg mb-8">Your trusted platform for managing medical appointments</p>
        <button onClick={handleGetStartedClick} className="bg-white text-blue-600 py-3 px-8 rounded-full text-lg font-semibold shadow-md hover:bg-gray-100 transition duration-300">
          Get Started
        </button>
      </animated.div>

      {/* Services Section */}
      <div className="max-w-6xl w-full py-16 px-8 text-center">
        <h2 className="text-3xl font-bold mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <animated.div className="bg-white p-6 rounded-lg shadow-md" style={slideInLeft}>
            <h3 className="text-xl font-semibold mb-4">Appointment Scheduling</h3>
            <p className="text-gray-700">Easily schedule and manage your appointments with our user-friendly interface.</p>
          </animated.div>
          <animated.div className="bg-white p-6 rounded-lg shadow-md" style={fadeIn}>
            <h3 className="text-xl font-semibold mb-4">Doctor Consultations</h3>
            <p className="text-gray-700">Connect with experienced doctors for your medical needs.</p>
          </animated.div>
          <animated.div className="bg-white p-6 rounded-lg shadow-md" style={slideInRight}>
            <h3 className="text-xl font-semibold mb-4">Health Records</h3>
            <p className="text-gray-700">Securely store and access your health records anytime, anywhere.</p>
          </animated.div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-6xl w-full py-16 px-8 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-12">Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700 mb-4">"MedHelp has made managing my medical appointments so much easier. Highly recommended!"</p>
            <p className="text-gray-600">- John Doe, Patient</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700 mb-4">"As a doctor, I find MedHelp extremely helpful in organizing my schedule and appointments."</p>
            <p className="text-gray-600">- Dr. Jane Smith, Physician</p>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="max-w-6xl w-full py-16 px-8 text-center">
        <h2 className="text-3xl font-bold mb-8">Join MedHelp Today</h2>
        <p className="text-gray-700 mb-12">Take control of your health management with our comprehensive platform.</p>
        <button onClick={handleGetStartedClick} className="bg-blue-600 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-md hover:bg-blue-700 transition duration-300">
          Sign Up Now
        </button>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 bg-gray-800 text-white text-center">
        <p>Made with <span className="text-red-500">&hearts;</span> by Debanjan</p>
      </footer>
    </div>
  );
};

export default HomePage;
