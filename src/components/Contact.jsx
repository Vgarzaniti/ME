import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "../styles/Contact.css";

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
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const email = "valenxity@gmail.com";
  const whatsappNumber = "5492213542002";
  const whatsappDisplay = "+54 221 354 2002";

  const servicesOptions = t.contact.servicesOptions;

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: servicesOptions[0],
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

  const handleSubmitForm = (e) => {
    e.preventDefault();
    setFormStatus("submitting");

    setTimeout(() => {
      setSubmittedData({ ...formData });
      setFormStatus("success");
    }, 400);
  };

  const whatsappMessage = submittedData
    ? language === "es"
      ? `Hola Valentín! Te contacto por tu web de Garzaniti IT.%0A%0A*Nombre:* ${encodeURIComponent(submittedData.name)}%0A*Email:* ${encodeURIComponent(submittedData.email)}%0A*Servicio:* ${encodeURIComponent(submittedData.service)}%0A*Presupuesto:* ${encodeURIComponent(submittedData.budget)}%0A%0A*Mensaje:* ${encodeURIComponent(submittedData.message)}`
      : `Hi Valentín! Contacting you from Garzaniti IT.%0A%0A*Name:* ${encodeURIComponent(submittedData.name)}%0A*Email:* ${encodeURIComponent(submittedData.email)}%0A*Service:* ${encodeURIComponent(submittedData.service)}%0A*Budget:* ${encodeURIComponent(submittedData.budget)}%0A%0A*Message:* ${encodeURIComponent(submittedData.message)}`
    : `https://wa.me/${whatsappNumber}?text=Hi%20Valent%C3%ADn,%20I'm%20contacting%20you%20from%20your%20portfolio.`;

  const whatsappForwardUrl = submittedData
    ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
    : `https://wa.me/${whatsappNumber}?text=Hola%20Valent%C3%ADn,%20te%20contacto%20desde%20tu%20portfolio.`;

  const emailSubject = encodeURIComponent(
    submittedData
      ? `Proyecto: ${submittedData.service} - ${submittedData.name}`
      : "Project Inquiry - Garzaniti IT"
  );
  const emailBody = encodeURIComponent(
    submittedData
      ? `Hola Valentín,\n\nSoy ${submittedData.name} (${submittedData.email}).\nMe interesa avanzar en: ${submittedData.service}.\nPresupuesto: ${submittedData.budget}.\n\nDetalles:\n${submittedData.message}`
      : "Hi Valentín,\n\nI'm interested in discussing a project regarding..."
  );
  const emailForwardUrl = `mailto:${email}?subject=${emailSubject}&body=${emailBody}`;

  return (
    <section id="contact" className="contact-section">
      <div className="section-badge">{t.contact.badge}</div>
      <h2 className="section-heading">{t.contact.heading}</h2>
      <p className="contact-subtext">{t.contact.subtitle}</p>

      <div className="contact-container">
        {/* Quick Message Form */}
        <div className="contact-form-card">
          <div className="form-card-header">
            <span className="form-dot" />
            <h3>{t.contact.heading}</h3>
            <span className="form-badge">
              {language === "es" ? "Respuesta: < 2h" : "Average Response: < 2h"}
            </span>
          </div>

          {formStatus === "success" ? (
            <div className="form-success-box">
              <span className="success-icon">🎉</span>
              <h4>{t.contact.success.title}</h4>
              <p>{t.contact.success.desc}</p>

              <div className="instant-dispatch-box">
                <span className="dispatch-title">
                  {language === "es"
                    ? "¿Querés continuar la conversación al instante?"
                    : "Want an instant conversation right now?"}
                </span>
                <p className="dispatch-sub">
                  {language === "es"
                    ? "Reenviá tu consulta directo a mi WhatsApp o correo:"
                    : "Forward your inquiry directly to my WhatsApp or Email:"}
                </p>
                <div className="dispatch-buttons">
                  <a
                    href={whatsappForwardUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="dispatch-btn dispatch-wa"
                  >
                    <WhatsAppIcon />
                    <span>{t.contact.success.whatsappBtn}</span>
                  </a>
                  <a
                    href={emailForwardUrl}
                    className="dispatch-btn dispatch-mail"
                  >
                    <GmailIcon />
                    <span>
                      {language === "es"
                        ? "✉️ Enviar a Cliente de Mail ↗"
                        : "✉️ Send to Email Client ↗"}
                    </span>
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFormStatus("idle");
                  setSubmittedData(null);
                }}
                className="reset-form-btn"
              >
                {t.contact.success.newInquiryBtn}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitForm} className="inquiry-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">{t.contact.form.nameLabel}</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder={t.contact.form.namePlaceholder}
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">{t.contact.form.emailLabel}</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder={t.contact.form.emailPlaceholder}
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="service">{t.contact.form.serviceLabel}</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                  >
                    {servicesOptions.map((srv, idx) => (
                      <option key={idx} value={srv}>
                        {srv}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="budget">{t.contact.form.budgetLabel}</label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                  >
                    <option value="<$500">&lt; $500 USD</option>
                    <option value="$500 - $1,500">$500 - $1,500 USD</option>
                    <option value="$1,500 - $3,000">$1,500 - $3,000 USD</option>
                    <option value=">$3,000">&gt; $3,000 USD</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">{t.contact.form.messageLabel}</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  required
                  placeholder={t.contact.form.messagePlaceholder}
                  value={formData.message}
                  onChange={handleInputChange}
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === "submitting"}
                className={`submit-inquiry-btn ${formStatus === "submitting" ? "submitting" : ""}`}
              >
                {formStatus === "submitting"
                  ? language === "es"
                    ? "Enviando Consulta..."
                    : "Sending Details..."
                  : t.contact.form.submitBtn}
              </button>
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
                <span className="rich-name">{t.contact.direct.linkedinTitle}</span>
                <span className="rich-handle">LinkedIn Profile ↗</span>
              </div>
              <span className="network-pill">
                {t.contact.direct.linkedinAction}
              </span>
            </div>
            <p className="rich-bio">{t.contact.direct.linkedinRole}</p>
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
                <span className="rich-name">{t.contact.direct.whatsappTitle}</span>
                <span className="rich-handle">{whatsappDisplay}</span>
              </div>
              <span className="status-live-pill">{t.contact.direct.whatsappStatus}</span>
            </div>
            <p className="rich-bio">{t.contact.direct.whatsappDesc}</p>
            <div className="rich-card-footer">
              <span className="rich-action-label">
                {language === "es" ? "Iniciar Chat de WhatsApp ↗" : "Start WhatsApp Chat ↗"}
              </span>
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
                <span className="rich-name">{t.contact.direct.githubTitle}</span>
                <span className="rich-handle">@Vgarzaniti • Full-Stack</span>
              </div>
              <span className="gh-badge">{t.contact.direct.githubBadge}</span>
            </div>
            <p className="rich-bio">
              {language === "es"
                ? "Código abierto, CLUD2025, Suchus-Design, DocTor-History y Wordle RN."
                : "Open source code, CLUD2025, Suchus-Design, DocTor-History & Wordle RN."}
            </p>
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
                <span className="rich-name">{t.contact.direct.emailTitle}</span>
                <span className="rich-handle">{email}</span>
              </div>
            </div>
            <p className="rich-bio" style={{ margin: "0.4rem 0 0.8rem", fontSize: "0.82rem", color: "#94a3b8" }}>
              {t.contact.direct.emailDesc}
            </p>
            <div className="rich-mail-actions">
              <button type="button" onClick={handleCopyEmail} className="rich-mail-btn copy">
                {copied ? `✔ ${t.contact.copiedBtn}` : `📋 ${t.contact.copyBtn}`}
              </button>
              <a href={emailForwardUrl} className="rich-mail-btn send">
                {language === "es" ? "Abrir Cliente ↗" : "Open Client ↗"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
