import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import About from "./About";

describe("About component with Bento Grid", () => {
  it("renders about heading and credentials", () => {
    render(<About />);

    expect(screen.getByText(/About Me & Skills Lab/i)).toBeInTheDocument();
    expect(screen.getByText(/Core Technical Pillars/i)).toBeInTheDocument();
  });

  it("interacts with the live React state tester in Bento 2", () => {
    render(<About />);

    const stateBtn = screen.getByText(/State:/i);
    expect(screen.getByText(/42/i)).toBeInTheDocument();

    fireEvent.click(stateBtn);
    expect(screen.getByText(/43/i)).toBeInTheDocument();
  });

  it("executes the SQL query benchmark in Bento 1", () => {
    render(<About />);

    const runBtn = screen.getByText(/Execute Query/i);
    fireEvent.click(runBtn);

    expect(screen.getByText(/4 rows returned/i)).toBeInTheDocument();
  });
});
