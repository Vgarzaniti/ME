import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider } from "../context/LanguageContext";
import Services from "./Services";

describe("Services component", () => {
  it("renders services section heading and tabs in default Spanish", () => {
    render(
      <LanguageProvider>
        <Services />
      </LanguageProvider>
    );

    expect(screen.getByText(/Cómo Puedo Ayudar a tu Negocio/i)).toBeInTheDocument();
    expect(screen.getByText(/n8n y Automatización de Negocios/i)).toBeInTheDocument();
  });

  it("switches tabs when clicked", () => {
    render(
      <LanguageProvider>
        <Services />
      </LanguageProvider>
    );

    const fullstackTab = screen.getByRole("button", { name: /MVPs/i });
    fireEvent.click(fullstackTab);

    expect(screen.getByText(/De la idea a producción en semanas/i)).toBeInTheDocument();
  });
});
