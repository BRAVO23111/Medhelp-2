import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { 
  MdCalendarToday,
  MdHealthAndSafety,
  MdMedicalServices,
  MdArrowForward,
  MdStar,
  MdVerified,
  MdAccessTime
} from 'react-icons/md';
import Image1 from '../assets/Image1.png';
import Avatar1 from '../assets/avatar1.svg';
import Avatar2 from '../assets/avatar2.svg';
import Avatar3 from '../assets/avatar3.svg';
const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    const userId = window.localStorage.getItem('userId');
    navigate(userId ? '/bookappointment' : '/login');
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const fadeIn = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { duration: 0.5 }
  };

  const staggerChildren = {
    initial: { opacity: 0 },
    whileInView: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Navigation is handled by Navbar component */}
      
      {/* Hero Section */}
      <motion.section 
        className="py-16 md:py-24 bg-blue-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            className="md:w-1/2 mb-10 md:mb-0"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              Healthcare Appointments<br />
              <span className="text-blue-700">Made Simple</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-lg">
              Book appointments with local doctors in minutes. Skip the phone calls and paperwork.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button
                onClick={handleGetStartedClick}
                className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition duration-300 flex items-center space-x-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>Book Appointment</span>
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/how-it-works')}
                className="bg-white text-blue-600 border border-blue-200 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                How It Works
              </motion.button>
            </div>
            
            <div className="mt-8 flex items-center">
              <TrustIndicator />
              <p className="ml-4 text-sm text-gray-600">Trusted by <span className="font-semibold">10,000+</span> patients monthly</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 relative"
            variants={fadeIn}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
              <div className="bg-white-200 h-48 rounded-md mb-6 flex items-center justify-center text-gray-500 text-sm">
                <img src={Image1} alt="Healthcare illustration" className="w-full h-full object-contain" />
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <MdAccessTime className="text-blue-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Quick Scheduling</h3>
                    <p className="text-sm text-gray-600">Book appointments in under 60 seconds</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <MdVerified className="text-green-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Verified Doctors</h3>
                    <p className="text-sm text-gray-600">All healthcare providers are verified professionals</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <MdStar key={i} className="text-yellow-400 w-4 h-4" />
                    ))}
                  </div>
                  <span className="text-xs font-medium ml-2">4.8/5 rating from 2000+ users</span>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4">
              <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-full shadow-sm border border-yellow-100">
                <MdStar className="text-yellow-400 w-4 h-4 mr-1" />
                <span className="text-xs font-medium">4.8/5 rating from 2000+ users</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900">Why Choose MedHelp</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Our platform makes healthcare accessible and convenient for everyone</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: MdAccessTime, 
                title: "Quick Scheduling", 
                description: "Book appointments in under 60 seconds with our streamlined process",
                bgColor: "bg-blue-100",
                iconColor: "text-blue-600" 
              },
              { 
                icon: MdVerified, 
                title: "Verified Doctors", 
                description: "All healthcare providers are verified professionals with proven credentials",
                bgColor: "bg-green-100",
                iconColor: "text-green-600" 
              },
              { 
                icon: MdHealthAndSafety, 
                title: "Secure & Private", 
                description: "Your health information is protected with bank-level security standards",
                bgColor: "bg-purple-100",
                iconColor: "text-purple-600" 
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white border border-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`${feature.bgColor} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                  <feature.icon className={`${feature.iconColor} w-6 h-6`} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonial Section */}
      <motion.section 
        className="py-16 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900">Trusted by Thousands</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">See what our users have to say about their experience</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <MdStar key={i} className="text-yellow-400 w-4 h-4" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 text-sm">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full mr-3 flex items-center justify-center text-blue-600 font-medium text-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{testimonial.name}</p>
                    <p className="text-gray-500 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-8 text-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-yellow-50 px-4 py-2 rounded-full">
              <MdStar className="text-yellow-400 w-4 h-4 mr-1" />
              <span className="text-sm font-medium">4.8/5 rating from 2000+ users</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-16 bg-blue-600 text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Book Your First Appointment?</h2>
            <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto">Join thousands of patients who have simplified their healthcare experience</p>
            <motion.button
              onClick={handleGetStartedClick}
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition duration-300 inline-flex items-center space-x-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>Get Started Now</span>
              <MdArrowForward className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer 
        className="bg-gray-900 text-gray-300 py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <motion.div 
              className="col-span-2 md:col-span-1"
              variants={fadeInUp}
            >
              <h3 className="text-xl font-bold text-white mb-4">MedHelp</h3>
              <p className="text-gray-400 text-sm">Making healthcare accessible and efficient for everyone.</p>
            </motion.div>
            {['Company', 'Services', 'Legal', 'Support'].map((section, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
              >
                <h4 className="text-md font-semibold text-white mb-3">{section}</h4>
                <ul className="space-y-2">
                  {['About', 'Features', 'Team'].map((item, i) => (
                    <li key={i}>
                      <a href="#" className="text-sm text-gray-400 hover:text-white transition duration-300">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
          <motion.div 
            className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400 text-sm"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p>&copy; 2024 MedHelp. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

// Trust Indicator Component with Animated Tooltips
const TrustIndicator = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig);
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig);
  
  const handleMouseMove = (event) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  const avatars = [
    { id: 1, image: Avatar1, name: "Sarah Johnson", designation: "Patient since 2022" },
    { id: 2, image: Avatar2, name: "Dr. Michael Chen", designation: "Verified Doctor" },
    { id: 3, image: Avatar3, name: "Emma Wilson", designation: "Regular Patient" }
  ];

  return (
    <div className="flex -space-x-2">
      {avatars.map((avatar) => (
        <div
          className="group relative"
          key={avatar.id}
          onMouseEnter={() => setHoveredIndex(avatar.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="wait">
            {hoveredIndex === avatar.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-xs shadow-xl"
              >
                <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
                <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
                <div className="relative z-30 text-base font-bold text-white">
                  {avatar.name}
                </div>
                <div className="text-xs text-blue-100">{avatar.designation}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <img
            onMouseMove={handleMouseMove}
            src={avatar.image}
            alt={avatar.name}
            className="relative h-8 w-8 rounded-full border-2 border-white object-cover transition duration-500 group-hover:z-30 group-hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
};

export default HomePage;