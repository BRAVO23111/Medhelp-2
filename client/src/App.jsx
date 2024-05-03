import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil'; // Import RecoilRoot
import './App.css';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import DoctorList from './components/DoctorList';
import Bookappointment from './components/BookAppointment';
import ViewAppointment from './components/ViewAppoinments';
import AdminDashboard from './components/AdminDashboard';
import Doctordashboard from './components/Doctordashboard';
import AddDoctor from './components/AddDoctor';
import ManageDoctors from './components/MangeDoctor';
import HomePage from './components/Home';
import PatientDashboard from './components/PatientDashboard';
import toast, { Toaster } from 'react-hot-toast';


function App() {
  return (
    <RecoilRoot>
      <Toaster
  position="top-center"
  reverseOrder={false}
  gutter={8}
  containerClassName=""
  containerStyle={{}}
  toastOptions={{
    // Define default options
    className: '',
    duration: 5000,
    style: {
      background: '#363636',
      color: '#fff',
    },

    // Default options for specific types
    success: {
      duration: 3000,
      theme: {
        primary: 'green',
        secondary: 'black',
      },
    },
  }}
/>
      <Router>
        <div>
          <Navbar />
          <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='/bookappointment' element={<DoctorList/>}/>
            <Route path='/patientDashboard' element={<PatientDashboard/>} />
            <Route path="/bookappointment/:doctorId" element={<Bookappointment />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/viewappointments' element={<ViewAppointment />} />
            <Route path='/admindashboard' element={<AdminDashboard />} />
            <Route path='/doctordashboard' element={<Doctordashboard />} />
            <Route path='/adddoctor' element={<AddDoctor />} />
            <Route path='/manage' element={<ManageDoctors />} />
          </Routes>
        </div>
      </Router>
    </RecoilRoot>
  );
}

export default App;
