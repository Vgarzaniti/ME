/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../data/translations";

const LanguageContext = createContext({
  language: "es",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: translations.es,
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const stored = localStorage.getItem("preferred_lang");
      if (stored === "en" || stored === "es") return stored;
    } catch {
      // Ignore localStorage access issues in restricted environments
    }
    return "es"; // Default to Spanish as requested
  });

  const setLanguage = (lang) => {
    if (lang === "es" || lang === "en") {
      setLanguageState(lang);
      try {
        localStorage.setItem("preferred_lang", lang);
      } catch {
        // Ignore
      }
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es");
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t: translations[language] || translations.es,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
