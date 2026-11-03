import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Contact from "./Contact";

describe("Contact component", () => {
  it("renders the contact heading and form fields", () => {
    render(<Contact />);

    expect(screen.getByText(/Let's Build Something Great/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Name \/ Company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Work Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Service Needed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Project Description \/ Goals/i)).toBeInTheDocument();
  });

  it("submits the inquiry form and displays confirmation", async () => {
    render(<Contact />);

    fireEvent.change(screen.getByLabelText(/Your Name \/ Company/i), {
      target: { value: "Valentin Test" },
    });
    fireEvent.change(screen.getByLabelText(/Work Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Project Description \/ Goals/i), {
      target: { value: "Need n8n workflow for CRM automation." },
    });

    fireEvent.click(screen.getByText(/Submit Project Request/i));

    expect(await screen.findByText(/Inquiry Registered!/i)).toBeInTheDocument();
  });
});
