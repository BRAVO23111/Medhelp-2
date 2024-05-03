import React from 'react';
import { Link } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';

const HomePage = () => {
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  const slideInLeft = useSpring({
    opacity: 1,
    marginLeft: 0,
    from: { opacity: 0, marginLeft: -100 },
    config: { duration: 1000 },
  });

  const slideInRight = useSpring({
    opacity: 1,
    marginRight: 0,
    from: { opacity: 0, marginRight: -100 },
    config: { duration: 1000 },
  });

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <animated.div className="max-w-4xl w-full p-8 bg-white shadow-lg rounded-lg" style={fadeIn}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <animated.div style={slideInLeft}>
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to MedHelp</h1>
            <p className="text-lg text-gray-700 mb-8">Your trusted platform for managing medical appointments.</p>
          </animated.div>
          <animated.div style={slideInRight}>
            <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
            <p className="text-gray-700 mb-4">Already have an account? Click below to log in and manage your appointments.</p>
            <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg text-center block mb-4">Login</Link>
            <p className="text-gray-700 mb-4">New to MedHelp? Register now to create an account and get started.</p>
            <Link to="/register" className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg text-center block">Register</Link>
          </animated.div>
        </div>
      </animated.div>

      {/* Testimonial section */}
      <div className="max-w-4xl w-full p-8 bg-white shadow-lg rounded-lg mt-8">
        <h2 className="text-2xl font-semibold mb-4">Why Choose MedHelp?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-700 mb-4">"MedHelp has made managing my medical appointments so much easier. Highly recommended!"</p>
            <p className="text-gray-600">- John Doe, Patient</p>
          </div>
          <div>
            <p className="text-gray-700 mb-4">"As a doctor, I find MedHelp extremely helpful in organizing my schedule and appointments."</p>
            <p className="text-gray-600">- Dr. Jane Smith, Physician</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-gray-600 mt-8">
        <p>Made with <span className="text-red-500">&hearts;</span> by Debanjan</p>
      </footer>
    </div>
  );
};

export default HomePage;
