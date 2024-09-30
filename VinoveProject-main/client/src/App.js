import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './component/Home';
import Client from './component/Roles/Client';
import Admin from './component/Roles/Admin';
// import './style.css';

function App() {
  const [userType, setUserType] = useState(null);

  const handleLogin = (username, password) => {
    if (username === 'admin' && password === '0000') {
      setUserType('admin');
    } else if (username === 'client' && password === '1111') {
      setUserType('client');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home onLogin={handleLogin} />} />
        <Route path="/client" element={userType === 'client' ? <Client /> : <Navigate to="/" />} />
        <Route path="/admin" element={userType === 'admin' ? <Admin /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
