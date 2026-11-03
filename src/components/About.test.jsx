import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import About from "./About";

describe("About component with Unified 3D Architecture Rig", () => {
  it("renders about credentials and the unified architecture stage", () => {
    render(<About />);

    expect(screen.getByText(/About Me & Skills Architecture/i)).toBeInTheDocument();
    expect(screen.getByText(/The Full-Stack Architecture Rig/i)).toBeInTheDocument();
    expect(screen.getByText(/Unified System Canvas • Zero Cards/i)).toBeInTheDocument();
    expect(screen.getByText("SERVER RACK")).toBeInTheDocument();
    expect(screen.getByText("CLOUD TOWER")).toBeInTheDocument();
  });

  it("interacts with the database blade query button", () => {
    render(<About />);

    const dbQueryBtn = screen.getByRole("button", { name: /Query Database Blade/i });
    expect(dbQueryBtn).toBeInTheDocument();

    fireEvent.click(dbQueryBtn);
    expect(screen.getByText(/Q#2 • 18ms latency/i)).toBeInTheDocument();
  });

  it("triggers the n8n data pulse in the conduit system", () => {
    render(<About />);

    const n8nPulseBtn = screen.getByRole("button", { name: /Fire n8n Data Pulse/i });
    expect(n8nPulseBtn).toBeInTheDocument();

    fireEvent.click(n8nPulseBtn);
    expect(n8nPulseBtn).toHaveClass("active");
  });
});
