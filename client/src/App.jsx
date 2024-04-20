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

function App() {
  return (
    <RecoilRoot> 
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path='/' element={<DoctorList />} />
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
