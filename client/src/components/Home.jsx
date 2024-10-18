import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUserMd, FaFileAlt, FaArrowRight } from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    const userId = window.localStorage.getItem('userId');
    navigate(userId ? '/bookappointment' : '/login');
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      {/* <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">MedHelp</h1>
          <button onClick={handleGetStartedClick} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            Get Started
          </button>
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">Your Health, Simplified</h2>
          <p className="text-xl mb-8 text-gray-600 max-w-2xl mx-auto">Manage appointments, consult doctors, and access your health records - all in one place.</p>
          <button onClick={handleGetStartedClick} className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-300 flex items-center mx-auto">
            Start Your Journey
            <FaArrowRight className="ml-2" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FaCalendarAlt, title: "Easy Scheduling", description: "Book and manage appointments with just a few clicks." },
              { icon: FaUserMd, title: "Expert Consultations", description: "Connect with top healthcare professionals for personalized care." },
              { icon: FaFileAlt, title: "Secure Health Records", description: "Access and manage your medical history securely, anytime." }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
                <feature.icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What Our Users Say</h2>
          <div className="bg-gray-100 p-8 rounded-lg shadow-sm">
            <p className="text-lg text-gray-700 mb-4 italic">"MedHelp has revolutionized how I manage my health. It's user-friendly and efficient!"</p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full mr-4 flex items-center justify-center text-white font-bold text-xl">JD</div>
              <div>
                <p className="font-semibold text-gray-800">John Doe</p>
                <p className="text-gray-600">Patient</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Health?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied users and start your health journey today.</p>
          <button onClick={handleGetStartedClick} className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition duration-300 inline-flex items-center">
            Get Started Now
            <FaArrowRight className="ml-2" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="mb-4 md:mb-0">&copy; 2024 MedHelp. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-400 transition duration-300">Privacy</a>
            <a href="#" className="hover:text-blue-400 transition duration-300">Terms</a>
            <a href="#" className="hover:text-blue-400 transition duration-300">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;