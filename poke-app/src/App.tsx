import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/auth/login/index.jsx";
import Register from "./components/auth/register/index.jsx";
import Home from "./components/home/index";
import Navbar from './components/nav/index.jsx';
import GettingStarted from './components/gettingStarted/index.jsx';
import AboutPage from './components/about/index.jsx'
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  const isAuthenticated = false; 


  return (
    <>
    
    <Router>
    <Navbar/>
      <Routes>
        {/* Default route redirects to Login */}
        <Route path="/" element={<Navigate to="/start" />} />
        {/* Login Page */}
        <Route path="/login" element={<Login />} />
        {/* Register Page */}
        <Route path="/register" element={<Register />} />
        {/* Getting Started Page */}
        <Route path="/start" element={<GettingStarted />} />
         {/* About Page */}
         <Route path="/about" element={<AboutPage />} />
        {/* Home Page */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        
      </Routes>
    </Router>
    </>
  );
};

export default App;

