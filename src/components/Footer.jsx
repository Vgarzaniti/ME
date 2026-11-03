import React, { useState } from "react";
import "../styles/Footer.css";

// Official brand SVG icons
const GitHubIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.79 14.07c-.24.67-1.21 1.28-1.72 1.33-.49.05-1.07.13-3.41-.83-2.58-1.06-4.22-3.7-4.35-3.87-.13-.17-1.04-1.39-1.04-2.65 0-1.26.66-1.88.89-2.13.23-.25.5-.32.67-.32.17 0 .34.002.49.009.15.008.36-.06.56.42.21.5.71 1.74.77 1.87.06.13.1.28.02.45-.08.17-.12.28-.24.42-.12.14-.26.32-.37.43-.12.12-.25.25-.11.49.14.24.63 1.04 1.36 1.69.94.84 1.73 1.1 1.97 1.22.24.12.38.1.52-.06.14-.17.6-.7.76-.94.16-.24.33-.2.55-.12.23.08 1.45.69 1.7 1.01.25.32.25.47.19.8-.06.33-.31.94-.55 1.16z" />
  </svg>
);

const GmailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

function Footer() {
  const [copied, setCopied] = useState(false);
  const email = "valenxity@gmail.com";
  const whatsappNumber = "5492213542002";
  const whatsappDisplay = "+54 221 354 2002";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi%20Valent%C3%ADn,%20I'm%20contacting%20you%20from%20your%20portfolio.`;

  const handleCopyEmail = (e) => {
    e.preventDefault();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <footer className="footer-site">
      <div className="footer-container">
        {/* Brand & Identity Column */}
        <div className="footer-col footer-brand-col">
          <div className="footer-logo">
            <span className="logo-dot" />
            <span className="logo-text">Garzaniti IT</span>
          </div>
          <p className="footer-tagline">
            Full-Stack Software Engineer & Workflow Automation Specialist.
            Building resilient digital products from database to cloud deployment.
          </p>
          <div className="footer-badge-available">
            <span className="badge-pulse-dot" />
            <span>Open for freelance contracts & technical roles</span>
          </div>

          <div className="footer-nav-links-block">
            <h4 className="footer-mini-title">Navigation</h4>
            <div className="footer-pills-row">
              <a href="/#hero" className="footer-pill">Home</a>
              <a href="/#services" className="footer-pill">Services</a>
              <a href="/#projects" className="footer-pill">Projects</a>
              <a href="/#about" className="footer-pill">About</a>
              <a href="/#contact" className="footer-pill">Contact</a>
            </div>
          </div>
        </div>

        {/* Rich Interactive Profiles & Contact Column */}
        <div className="footer-col footer-profiles-col">
          <h4 className="footer-col-title">Connect & Direct Contact</h4>

          <div className="footer-cards-grid">
            {/* LinkedIn Rich Card with Photo & Summary */}
            <a
              href="https://www.linkedin.com/in/valent%C3%ADn-garzaniti-216946238/"
              target="_blank"
              rel="noreferrer"
              className="footer-profile-card linkedin-card"
            >
              <div className="card-avatar-box">
                <img
                  src="/profile.png"
                  alt="Valentín Garzaniti"
                  className="profile-photo"
                />
                <span className="platform-icon-badge in-badge">in</span>
              </div>
              <div className="card-info">
                <div className="card-title-row">
                  <span className="profile-name">Valentín Augusto Garzaniti</span>
                  <span className="connect-tag">Connect ↗</span>
                </div>
                <p className="profile-role">
                  Information Systems Engineering @ UTN FRLP
                </p>
                <p className="profile-desc">
                  Full-Stack Developer • Python, React & n8n Workflow Automation
                </p>
              </div>
            </a>

            {/* GitHub Official Logo Card */}
            <a
              href="https://github.com/Vgarzaniti/"
              target="_blank"
              rel="noreferrer"
              className="footer-profile-card github-card"
            >
              <div className="card-avatar-box">
                <div className="platform-avatar-circle gh-circle">
                  <GitHubIcon />
                </div>
              </div>
              <div className="card-info">
                <div className="card-title-row">
                  <span className="profile-name">GitHub</span>
                  <span className="repo-count-pill">15 Repos ↗</span>
                </div>
                <p className="profile-role">@Vgarzaniti • Full-Stack Engineer</p>
                <p className="profile-desc">
                  Open source contributions, CLUD2025, Suchus-Design & DocTor-History
                </p>
              </div>
            </a>

            {/* WhatsApp Official Logo Card */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="footer-profile-card whatsapp-card"
            >
              <div className="card-avatar-box">
                <div className="platform-avatar-circle wa-circle">
                  <WhatsAppIcon />
                </div>
                <span className="status-online-dot" />
              </div>
              <div className="card-info">
                <div className="card-title-row">
                  <span className="profile-name">WhatsApp Direct</span>
                  <span className="online-pill">● Online</span>
                </div>
                <p className="profile-role">{whatsappDisplay}</p>
                <p className="profile-desc">
                  Instant messaging for client questions, proposals & project scope ↗
                </p>
              </div>
            </a>

            {/* Gmail Official Logo Card */}
            <div className="footer-profile-card email-card">
              <div className="card-avatar-box">
                <div className="platform-avatar-circle mail-circle">
                  <GmailIcon />
                </div>
              </div>
              <div className="card-info">
                <div className="card-title-row">
                  <span className="profile-name">Gmail</span>
                  <span className="inbox-tag">Direct Inbox</span>
                </div>
                <p className="profile-role">{email}</p>
                <div className="email-card-actions">
                  <button
                    onClick={handleCopyEmail}
                    className="email-action-btn copy"
                  >
                    {copied ? "✔ Copied to clipboard!" : "📋 Copy Email"}
                  </button>
                  <a
                    href={`mailto:${email}`}
                    className="email-action-btn send"
                  >
                    Open Mail App ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Tech Stack */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Valentín Augusto Garzaniti — Built with{" "}
          <span className="accent">React 19</span>, <span className="accent">Vite</span> & Systems Engineering @ UTN.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
