import React from "react";
import "../styles/Contact.css";

function Contact() {
  return (
    <section id="contact" className="contact">
      <h2>Contact</h2>
      <p>Interested in working together? Let’s connect 👇</p>
      <div className="contact-links">
        <a href="mailto:valenxity@gmail.com">Email</a>
        <a href="https://www.linkedin.com/in/valent%C3%ADn-garzaniti-216946238/" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href="https://github.com/Vgarzaniti/" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
    </section>
  );
}

export default Contact;
