import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "../context/LanguageContext";
import Navbar from "./Navbar";

describe("Navbar component", () => {
  it("renders default Spanish navigation links", () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </LanguageProvider>
    );

    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("Servicios")).toBeInTheDocument();
    expect(screen.getByText("Proyectos")).toBeInTheDocument();
    expect(screen.getByText("Sobre Mí")).toBeInTheDocument();
    expect(screen.getByText("Contacto")).toBeInTheDocument();
  });

  it("switches language to English when EN button is clicked", () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </LanguageProvider>
    );

    const enButton = screen.getByRole("button", { name: "English" });
    fireEvent.click(enButton);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });
});
