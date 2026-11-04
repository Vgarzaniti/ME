import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider } from "../context/LanguageContext";
import Services from "./Services";

describe("Services Interactive Mini-Web Sandbox", () => {
  it("renders services section heading and browser tabs in default Spanish", () => {
    render(
      <LanguageProvider>
        <Services />
      </LanguageProvider>
    );

    expect(screen.getByText(/Cómo Puedo Ayudar a tu Negocio/i)).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Tienda & SaaS/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /n8n & WhatsApp Bot/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Sistema ERP & Gestión/i })).toBeInTheDocument();
  });

  it("adds a product to cart and updates cart count in the Store Demo", () => {
    render(
      <LanguageProvider>
        <Services />
      </LanguageProvider>
    );

    const addButtons = screen.getAllByRole("button", { name: /\+ Agregar al Carrito/i });
    expect(addButtons.length).toBeGreaterThan(0);

    fireEvent.click(addButtons[0]);

    // Cart counter should now show 1
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("switches to n8n & WhatsApp Bot and triggers the live webhook flow", () => {
    render(
      <LanguageProvider>
        <Services />
      </LanguageProvider>
    );

    const botTab = screen.getByRole("tab", { name: /n8n & WhatsApp Bot/i });
    fireEvent.click(botTab);

    expect(screen.getByText(/Garzaniti IT Bot/i)).toBeInTheDocument();

    const triggerBtn = screen.getByRole("button", { name: /Disparar Webhook en Vivo/i });
    fireEvent.click(triggerBtn);

    expect(screen.getByText(/1\. Webhook Recibido/i)).toBeInTheDocument();
  });

  it("switches to ERP tab and adds a new transaction updating revenue", () => {
    render(
      <LanguageProvider>
        <Services />
      </LanguageProvider>
    );

    const erpTab = screen.getByRole("tab", { name: /Sistema ERP & Gestión/i });
    fireEvent.click(erpTab);

    expect(screen.getByText(/Garzaniti ERP • Panel de Control Operativo/i)).toBeInTheDocument();

    const addSaleBtn = screen.getByRole("button", { name: /\+ Registrar Venta/i });
    fireEvent.click(addSaleBtn);

    // Revenue increased from 38,450 to 39,650
    expect(screen.getByText(/\$39,650/i)).toBeInTheDocument();
  });
});
