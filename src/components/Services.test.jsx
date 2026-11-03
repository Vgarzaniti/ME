import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Services from "./Services";

describe("Services component", () => {
  it("renders services section heading and tabs", () => {
    render(<Services />);

    expect(screen.getByText(/How I Can Help Your Business/i)).toBeInTheDocument();
    expect(screen.getByText(/n8n & Business Automation/i)).toBeInTheDocument();
  });

  it("switches tabs when clicked", () => {
    render(<Services />);

    const fullstackTab = screen.getByText(/Custom Full-Stack Web Apps/i);
    fireEvent.click(fullstackTab);

    expect(screen.getByText(/Tailor-made web applications engineered for performance/i)).toBeInTheDocument();
  });
});
