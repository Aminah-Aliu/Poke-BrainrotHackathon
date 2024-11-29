import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/auth/login/index.jsx";
import Register from "./components/auth/register/index.jsx";
import Home from "./components/home/index.jsx";
import Navbar from './components/nav/index.jsx';
import ProtectedRoute from './components/ProtectedRoute';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

const App: React.FC = () => {
  const isAuthenticated = false; 

  return (
    <>
    
    <Router>
    <Navbar/>
      <Routes>
        {/* Default route redirects to Login */}
        <Route path="/" element={<Navigate to="/login" />} />
        {/* Login Page */}
        <Route path="/login" element={<Login />} />
        {/* Register Page */}
        <Route path="/register" element={<Register />} />
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

