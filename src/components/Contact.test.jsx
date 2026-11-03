import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider } from "../context/LanguageContext";
import Contact from "./Contact";

describe("Contact component", () => {
  it("renders the contact heading and form fields in default Spanish", () => {
    render(
      <LanguageProvider>
        <Contact />
      </LanguageProvider>
    );

    expect(screen.getByRole("heading", { level: 2, name: /Iniciemos tu Próximo Proyecto/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Tu Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tu Correo Electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/¿En qué solución estás interesado\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contanos sobre tu proyecto o necesidad/i)).toBeInTheDocument();
  });

  it("submits the inquiry form and displays confirmation", async () => {
    render(
      <LanguageProvider>
        <Contact />
      </LanguageProvider>
    );

    fireEvent.change(screen.getByLabelText(/Tu Nombre/i), {
      target: { value: "Valentin Test" },
    });
    fireEvent.change(screen.getByLabelText(/Tu Correo Electrónico/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Contanos sobre tu proyecto o necesidad/i), {
      target: { value: "Necesito automatizar facturación con n8n." },
    });

    fireEvent.click(screen.getByText(/Enviar Consulta de Proyecto/i));

    expect(await screen.findByText(/¡Consulta Registrada!/i)).toBeInTheDocument();
  });
});
