import React from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

function App() {
  return (
    <>
      {/* 🔝 Barra de navegación */}
      <Navbar />

      {/* 🏠 Sección principal */}
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>

      {/* 🧾 Footer simple */}
      <footer className="footer">
        <p>
          © {new Date().getFullYear()} Valentín Garzaniti — Built with{" "}
          <span className="accent">React</span> & ❤️
        </p>
      </footer>
    </>
  );
}

export default App;
