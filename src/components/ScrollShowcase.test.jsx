import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ScrollShowcase from "./ScrollShowcase";

describe("ScrollShowcase component", () => {
  it("renders showcase title and editor tabs", () => {
    render(<ScrollShowcase />);

    expect(
      screen.getByText(/Interactive Developer Terminal/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/server\/views.py/i)).toBeInTheDocument();
    expect(screen.getByText(/src\/App.jsx/i)).toBeInTheDocument();
    expect(screen.getByText(/interactive_terminal.sh/i)).toBeInTheDocument();
  });
});
