import React, { useContext, Fragment } from "react";
// import { auth } from "../../firebase/firebase";
// import { onAuthStateChanged } from "firebase/auth";
import { Link, NavLink, useNavigate } from "react-router-dom"
import './styles.css';
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from "../../firebase/auth";

export default function Navbar() {
    const { userLoggedIn, currentUser } = useAuth()
    const navigate = useNavigate();


    const onLogout = () => {
        doSignOut();
        navigate("/login");
    }

  

    const authLinks = (
        <Fragment>
            <a onClick={onLogout} href="#!">
              <i className="fas fa-sign-out-alt">{' '}</i> 
              <span className="hide-sm">Logout</span>
            </a>
        </Fragment>
      );

      const guestLinks = (
        <Fragment>
            <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : "")}>
            Register
            </NavLink>
            <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
            Login
            </NavLink>
        </Fragment>
      );
      
      
    return (
        <nav className="nav">
            <div className="left-links">
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                Poke
            </NavLink>
            <NavLink to="/start" className={({ isActive }) => (isActive ? "active" : "")}>
                Getting Started
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
                About
            </NavLink>

            </div>
            <div className="right-links">
                {userLoggedIn ? authLinks: guestLinks}
            </div>
        </nav>
    )
}

