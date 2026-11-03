import React from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "../styles/Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

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
    <header className="navbar-wrapper">
      <nav className="navbar">
        <a href="/" className="logo-link">
          <span className="logo-dot" />
          <span className="logo-text">Garzaniti IT</span>
        </a>

        <div className="nav-center-group">
          <ul className="nav-links">
            <li>
              <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
                {t.nav.home}
              </NavLink>
            </li>
            <li>
              <a
                href="#services"
                onClick={handleScroll("services")}
                className={location.hash === "#services" ? "active" : ""}
              >
                {t.nav.services}
              </a>
            </li>
            <li>
              <a
                href="#projects"
                onClick={handleScroll("projects")}
                className={location.hash === "#projects" ? "active" : ""}
              >
                {t.nav.projects}
              </a>
            </li>
            <li>
              <a
                href="#about"
                onClick={handleScroll("about")}
                className={location.hash === "#about" ? "active" : ""}
              >
                {t.nav.about}
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={handleScroll("contact")}
                className={location.hash === "#contact" ? "active" : ""}
              >
                {t.nav.contact}
              </a>
            </li>
          </ul>

          {/* Language Switcher Dropdown/Toggle */}
          <div className="lang-switcher" role="group" aria-label={t.nav.ariaLangToggle}>
            <button
              type="button"
              className={`lang-option ${language === "es" ? "active" : ""}`}
              onClick={() => setLanguage("es")}
              aria-label="Español"
            >
              ES
            </button>
            <span className="lang-sep">|</span>
            <button
              type="button"
              className={`lang-option ${language === "en" ? "active" : ""}`}
              onClick={() => setLanguage("en")}
              aria-label="English"
            >
              EN
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
