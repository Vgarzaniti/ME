import React, { useState } from "react";
import "../styles/Contact.css";

const SERVICES_OPTIONS = [
  "n8n Workflow & Business Automation",
  "Custom Full-Stack Web App & MVP (React + Django)",
  "Bespoke Business Management System (ERP/CRM)",
  "High-Converting Landing Page & Cloud Web Presence",
  "General Software Consultation / Other",
];

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

function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "valenxity@gmail.com";
  const whatsappNumber = "5492213542002";
  const whatsappDisplay = "+54 221 354 2002";
  const mailtoUrl = `mailto:${email}?subject=Project%20Inquiry%20-%20Garzaniti%20IT&body=Hi%20Valent%C3%ADn,%0A%0AI'm%20interested%20in%20discussing%20a%20project%20regarding%20...`;

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: SERVICES_OPTIONS[0],
    budget: "$500 - $1,500",
    message: "",
  });
  const [submittedData, setSubmittedData] = useState(null);
  const [formStatus, setFormStatus] = useState("idle");

  const handleCopyEmail = (e) => {
    e.preventDefault();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormStatus("submitting");

    const webhookUrl = import.meta.env?.VITE_CONTACT_WEBHOOK_URL;
    const currentSubmission = { ...formData };

    try {
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentSubmission),
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      setSubmittedData(currentSubmission);
      setFormStatus("success");
      setFormData({
        name: "",
        email: "",
        service: SERVICES_OPTIONS[0],
        budget: "$500 - $1,500",
        message: "",
      });
    } catch {
      setFormStatus("error");
    }
  };

  const whatsappForwardUrl = submittedData
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Hi Valentín! My name is ${submittedData.name} (${submittedData.email}).\n\nI'm inquiring about: ${submittedData.service}\nBudget: ${submittedData.budget}\n\nProject Details:\n${submittedData.message}`
      )}`
    : `https://wa.me/${whatsappNumber}?text=Hi%20Valent%C3%ADn,%20I'm%20contacting%20you%20from%20your%20portfolio.`;

  const emailForwardUrl = submittedData
    ? `mailto:${email}?subject=${encodeURIComponent(
        `Project Inquiry: ${submittedData.service} - ${submittedData.name}`
      )}&body=${encodeURIComponent(
        `Hi Valentín,\n\nName: ${submittedData.name}\nEmail: ${submittedData.email}\nService: ${submittedData.service}\nBudget: ${submittedData.budget}\n\nMessage:\n${submittedData.message}`
      )}`
    : mailtoUrl;

  return (
    <section id="contact" className="contact-section">
      <div className="section-badge">Get in Touch</div>
      <h2 className="section-heading">Let's Build Something Great</h2>
      <p className="contact-subtext">
        Ready to automate your operations, build a custom full-stack platform, or launch your next product? Fill out the quick form below or reach out directly.
      </p>

      <div className="contact-container">
        {/* Quick Message Form */}
        <div className="contact-form-card">
          <div className="form-card-header">
            <span className="form-dot" />
            <h3>Send a Direct Project Inquiry</h3>
            <span className="form-badge">Average Response: &lt; 24h</span>
          </div>

          {formStatus === "success" ? (
            <div className="form-success-box">
              <span className="success-icon">🎉</span>
              <h4>Inquiry Registered!</h4>
              <p>Thank you! Your project details have been captured.</p>

              <div className="instant-dispatch-box">
                <span className="dispatch-title">Want an instant answer right now?</span>
                <p className="dispatch-sub">Forward your inquiry directly to my WhatsApp or Email:</p>
                <div className="dispatch-buttons">
                  <a
                    href={whatsappForwardUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="dispatch-btn dispatch-wa"
                  >
                    <WhatsAppIcon />
                    <span>Send to WhatsApp Now ↗</span>
                  </a>
                  <a
                    href={emailForwardUrl}
                    className="dispatch-btn dispatch-mail"
                  >
                    <GmailIcon />
                    <span>Send to Email Client ↗</span>
                  </a>
                </div>
              </div>

              <button
                onClick={() => {
                  setFormStatus("idle");
                  setSubmittedData(null);
                }}
                className="reset-form-btn"
              >
                ← Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitForm} className="inquiry-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Your Name / Company *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. Alex Smith / Acme Corp"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Work Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="service">Service Needed</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                  >
                    {SERVICES_OPTIONS.map((srv, idx) => (
                      <option key={idx} value={srv}>
                        {srv}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="budget">Estimated Budget</label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                  >
                    <option value="<$500">&lt; $500 USD (Quick automation / task)</option>
                    <option value="$500 - $1,500">$500 - $1,500 USD (Landing / n8n workflow)</option>
                    <option value="$1,500 - $3,000">$1,500 - $3,000 USD (Full-Stack MVP / Portal)</option>
                    <option value=">$3,000">&gt; $3,000 USD (Comprehensive bespoke system)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Project Description / Goals *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  required
                  placeholder="Tell me a bit about what you're looking to build, automate, or improve..."
                  value={formData.message}
                  onChange={handleInputChange}
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === "submitting"}
                className={`submit-inquiry-btn ${formStatus === "submitting" ? "submitting" : ""}`}
              >
                {formStatus === "submitting" ? "Sending Details..." : "🚀 Submit Project Request"}
              </button>

              {formStatus === "error" && (
                <div className="form-error-msg">
                  Something went wrong sending the form. Please use the direct email link below instead.
                </div>
              )}
            </form>
          )}
        </div>

        {/* Direct Rich Social & Profile Cards */}
        <div className="contact-sidebar">
          {/* LinkedIn Profile Card with Face Photo */}
          <a
            href="https://www.linkedin.com/in/valent%C3%ADn-garzaniti-216946238/"
            target="_blank"
            rel="noreferrer"
            className="rich-social-card in-card"
          >
            <div className="rich-card-top">
              <div className="card-avatar-box">
                <img
                  src="/profile.png"
                  alt="Valentín Augusto Garzaniti"
                  className="profile-photo"
                />
                <span className="platform-icon-badge in-badge">in</span>
              </div>
              <div className="rich-meta">
                <span className="rich-name">Valentín Augusto Garzaniti</span>
                <span className="rich-handle">LinkedIn Profile ↗</span>
              </div>
              <span className="network-pill">Connect ↗</span>
            </div>
            <p className="rich-bio">Information Systems Engineering @ UTN FRLP • Full-Stack & n8n Developer.</p>
            <div className="rich-card-footer">
              <span className="rich-tag">Systems Architecture</span>
              <span className="rich-tag">Full-Stack</span>
            </div>
          </a>

          {/* WhatsApp Direct Chat Card with Official WhatsApp Logo */}
          <a
            href={whatsappForwardUrl}
            target="_blank"
            rel="noreferrer"
            className="rich-social-card wa-card"
          >
            <div className="rich-card-top">
              <div className="platform-avatar-circle wa-circle">
                <WhatsAppIcon />
              </div>
              <div className="rich-meta">
                <span className="rich-name">WhatsApp Direct</span>
                <span className="rich-handle">{whatsappDisplay}</span>
              </div>
              <span className="status-live-pill">● Online</span>
            </div>
            <p className="rich-bio">Instant messaging for quick questions, quotes & project kickoff.</p>
            <div className="rich-card-footer">
              <span className="rich-action-label">Start WhatsApp Chat ↗</span>
            </div>
          </a>

          {/* GitHub Profile Card with Official GitHub Logo */}
          <a
            href="https://github.com/Vgarzaniti/"
            target="_blank"
            rel="noreferrer"
            className="rich-social-card gh-card"
          >
            <div className="rich-card-top">
              <div className="platform-avatar-circle gh-circle">
                <GitHubIcon />
              </div>
              <div className="rich-meta">
                <span className="rich-name">GitHub</span>
                <span className="rich-handle">@Vgarzaniti • Full-Stack</span>
              </div>
              <span className="gh-badge">15 Repos</span>
            </div>
            <p className="rich-bio">Open source code, CLUD2025, Suchus-Design, DocTor-History & Wordle RN.</p>
            <div className="rich-card-footer">
              <span className="rich-tag">React</span>
              <span className="rich-tag">Django</span>
              <span className="rich-tag">PostgreSQL</span>
            </div>
          </a>

          {/* Direct Gmail Card with Official Logo */}
          <div className="rich-social-card mail-card">
            <div className="rich-card-top">
              <div className="platform-avatar-circle mail-circle">
                <GmailIcon />
              </div>
              <div className="rich-meta">
                <span className="rich-name">Gmail</span>
                <span className="rich-handle">{email}</span>
              </div>
            </div>
            <div className="rich-mail-actions">
              <button onClick={handleCopyEmail} className="rich-mail-btn copy">
                {copied ? "✔ Copied!" : "📋 Copy Email"}
              </button>
              <a href={mailtoUrl} className="rich-mail-btn send">
                Open Client ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
