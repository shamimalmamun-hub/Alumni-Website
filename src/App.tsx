/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import AdminDashboard from './components/AdminDashboard';
import RegistrationSuccess from './components/RegistrationSuccess';
import AdminLogin from './components/AdminLogin';
import { useState, useEffect } from 'react';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('admin_session') === 'true';
  });

  const handleAdminLogin = (status: boolean) => {
    setIsAdmin(status);
    if (status) {
      localStorage.setItem('admin_session', 'true');
    } else {
      localStorage.removeItem('admin_session');
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FDFCFB] font-sans text-[#1A1A1A]">
        <Routes>
          <Route path="/" element={<RegistrationForm />} />
          <Route path="/success/:id" element={<RegistrationSuccess />} />
          <Route 
            path="/login" 
            element={isAdmin ? <Navigate to="/admin" /> : <AdminLogin onLogin={handleAdminLogin} />} 
          />
          <Route 
            path="/admin/*" 
            element={isAdmin ? <AdminDashboard onLogout={() => handleAdminLogin(false)} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
