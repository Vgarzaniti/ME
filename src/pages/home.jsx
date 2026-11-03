import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/App.css";

import Hero from "../components/Hero";
import ScrollShowcase from "../components/ScrollShowcase";
import Services from "../components/Services";
import Projects from "../components/Projects";
import About from "../components/About";
import Contact from "../components/Contact";

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const target = location.hash.replace("#", "");
      const element = document.getElementById(target);
      if (element) {
        const navHeight = document.querySelector(".navbar")?.offsetHeight || 80;
        const y = element.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }, [location.hash]);

  return (
    <>
      <Hero />
      <ScrollShowcase />
      <Services />
      <Projects />
      <About />
      <Contact />
    </>
  );
}

export default Home;
