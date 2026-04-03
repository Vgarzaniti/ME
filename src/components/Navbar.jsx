import React from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const smoothScrollTo = (element) => {
    if (!element) return;
    const navHeight = document.querySelector(".navbar")?.offsetHeight || 80;
    const y = element.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const handleScroll = (target) => (event) => {
    event.preventDefault();

    if (location.pathname === "/") {
      const element = document.getElementById(target);
      smoothScrollTo(element);
      return;
    }

    navigate(`/#${target}`);
  };

  return (
    <nav className="navbar">
      <h2 className="logo">Valentín Garzaniti</h2>
      <ul className="nav-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
        </li>
        <li>
          <a href="#about" onClick={handleScroll("about")} className={location.hash === "#about" ? "active" : ""}>
            About
          </a>
        </li>
        <li>
          <a href="#projects" onClick={handleScroll("projects")} className={location.hash === "#projects" ? "active" : ""}>
            Projects
          </a>
        </li>
        <li>
          <a href="#contact" onClick={handleScroll("contact")} className={location.hash === "#contact" ? "active" : ""}>
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
