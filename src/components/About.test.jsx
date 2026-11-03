import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider } from "../context/LanguageContext";
import About from "./About";

describe("About component with Bento Grid Cards", () => {
  it("renders about credentials and the bento cards in default Spanish", () => {
    render(
      <LanguageProvider>
        <About />
      </LanguageProvider>
    );

    expect(screen.getByText(/Sobre Mí y Laboratorio de Habilidades/i)).toBeInTheDocument();
    expect(screen.getByText(/Pilares Técnicos Principales/i)).toBeInTheDocument();
    expect(screen.getByText(/Python, Django REST & PostgreSQL/i)).toBeInTheDocument();
    expect(screen.getByText(/React 19, CSS 3D Moderno y Estado/i)).toBeInTheDocument();
    expect(screen.getByText(/Motor n8n, Webhooks e Integraciones/i)).toBeInTheDocument();
  });

  it("interacts with the live React state counter in Bento 2", () => {
    render(
      <LanguageProvider>
        <About />
      </LanguageProvider>
    );

    const stateBtn = screen.getByRole("button", { name: /Estado:/i });
    expect(screen.getByText(/42/i)).toBeInTheDocument();

    fireEvent.click(stateBtn);
    expect(screen.getByText(/43/i)).toBeInTheDocument();
  });

  it("executes the SQL query benchmark in Bento 1", () => {
    render(
      <LanguageProvider>
        <About />
      </LanguageProvider>
    );

    const runBtn = screen.getByRole("button", { name: /Ejecutar Consulta/i });
    fireEvent.click(runBtn);

    expect(screen.getByText(/4 filas devueltas/i)).toBeInTheDocument();
  });
});
