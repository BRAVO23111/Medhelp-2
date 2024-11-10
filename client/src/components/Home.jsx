import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MdCalendarToday,
  MdHealthAndSafety,
  MdMedicalServices,
  MdArrowForward,
  MdStar
} from 'react-icons/md';

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    const userId = window.localStorage.getItem('userId');
    navigate(userId ? '/bookappointment' : '/login');
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    initial: { opacity: 0 },
    whileInView: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen font-sans">
      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto px-4 py-24">
          <motion.div 
            className="relative z-10"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Your Health Journey
              <span className="block text-blue-200">Starts Here</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl">
              Experience healthcare reimagined. Book appointments, consult experts, and manage your health records seamlessly.
            </p>
            <motion.button
              onClick={handleGetStartedClick}
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition duration-300 flex items-center space-x-2 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Get Started</span>
              <MdArrowForward className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </div>
        {/* Abstract background shapes */}
        <motion.div 
          className="absolute top-0 right-0 w-1/3 h-full opacity-10"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full bg-white rounded-full blur-3xl transform -translate-y-1/2"></div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-24"
        variants={staggerChildren}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold text-center mb-16 text-gray-800"
            variants={fadeInUp}
          >
            Comprehensive Healthcare Solutions
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: MdCalendarToday, 
                title: "Smart Scheduling", 
                description: "AI-powered appointment booking system that adapts to your preferences." 
              },
              { 
                icon: MdMedicalServices, 
                title: "Expert Care Network", 
                description: "Connect with specialized healthcare professionals instantly." 
              },
              { 
                icon: MdHealthAndSafety, 
                title: "Secure Health Vault", 
                description: "Bank-grade security for your medical records and personal information." 
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonial Section */}
      <motion.section 
        className="py-24 bg-gray-50"
        variants={fadeInUp}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Trusted by Thousands</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Patient",
                quote: "MedHelp has transformed how I manage my healthcare. The interface is intuitive and the service is exceptional!"
              },
              {
                name: "Dr. Michael Chen",
                role: "Healthcare Provider",
                quote: "As a doctor, I appreciate how MedHelp streamlines patient care and communication. It's a game-changer."
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <MdStar key={i} className="text-yellow-400 w-6 h-6" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic text-lg">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full mr-4 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-24 bg-gradient-to-r from-blue-600 to-blue-700 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Healthcare Experience?</h2>
            <p className="text-xl mb-8 text-blue-100">Join our growing community of health-conscious individuals.</p>
            <motion.button
              onClick={handleGetStartedClick}
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition duration-300 flex items-center space-x-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Start Your Journey</span>
              <MdArrowForward className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">MedHelp</h3>
              <p className="text-gray-400">Making healthcare accessible and efficient for everyone.</p>
            </div>
            {['Company', 'Services', 'Legal', 'Support'].map((section, index) => (
              <div key={index}>
                <h4 className="text-lg font-semibold text-white mb-4">{section}</h4>
                <ul className="space-y-2">
                  {['About', 'Features', 'Team'].map((item, i) => (
                    <li key={i}>
                      <a href="#" className="hover:text-white transition duration-300">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MedHelp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;