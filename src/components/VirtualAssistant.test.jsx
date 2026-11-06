import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "../context/LanguageContext";
import VirtualAssistant from "./VirtualAssistant";

// Mock Three.js WebGLRenderer & GLTFLoader
vi.mock("three", async () => {
  const actual = await vi.importActual("three");
  return {
    ...actual,
    WebGLRenderer: class {
      constructor() {
        this.domElement = document.createElement("canvas");
        this.outputColorSpace = "";
      }
      setSize() {}
      setPixelRatio() {}
      render() {}
      dispose() {}
    },
  };
});

vi.mock("three/examples/jsm/loaders/GLTFLoader.js", () => {
  return {
    GLTFLoader: class {
      load(_url, _onLoad, _onProgress, onError) {
        if (onError) onError(new Error("File not found"));
      }
    },
  };
});

// Helper component to trigger language change in tests
function LanguageSwitchTestWrapper() {
  const { toggleLanguage, language } = useLanguage();
  return (
    <div>
      <button type="button" onClick={toggleLanguage}>
        Current: {language}
      </button>
      <VirtualAssistant />
    </div>
  );
}

describe("VirtualAssistant component", () => {
  it("renders assistant stage and toggle button in default Spanish", () => {
    render(
      <LanguageProvider>
        <VirtualAssistant />
      </LanguageProvider>
    );

    const toggleBtn = screen.getByTitle("Minimizar asistente");
    expect(toggleBtn).toBeInTheDocument();
    expect(screen.getByText("Experimental")).toBeInTheDocument();
  });

  it("minimizes and restores the assistant on toggle click", () => {
    render(
      <LanguageProvider>
        <VirtualAssistant />
      </LanguageProvider>
    );

    const toggleBtn = screen.getByTitle("Minimizar asistente");
    fireEvent.click(toggleBtn);

    expect(screen.getByTitle("Restaurar asistente")).toBeInTheDocument();

    fireEvent.click(screen.getByTitle("Restaurar asistente"));
    expect(screen.getByTitle("Minimizar asistente")).toBeInTheDocument();
  });

  it("shows speech bubble on avatar click", () => {
    render(
      <LanguageProvider>
        <VirtualAssistant />
      </LanguageProvider>
    );

    const avatarBtn = screen.getByRole("button", { name: /Valentín 3D/i });
    act(() => {
      fireEvent.click(avatarBtn);
    });

    expect(screen.getByText("Valentín 3D")).toBeInTheDocument();
    expect(screen.getByText("En línea")).toBeInTheDocument();
  });

  it("updates assistant dialogue and buttons dynamically when language switches", () => {
    render(
      <LanguageProvider>
        <LanguageSwitchTestWrapper />
      </LanguageProvider>
    );

    // Switch to English
    const toggleLangBtn = screen.getByText("Current: es");
    act(() => {
      fireEvent.click(toggleLangBtn);
    });

    // Assistant should announce in English
    expect(
      screen.getByText(/Switched to English/i)
    ).toBeInTheDocument();

    // Quick action buttons should be localized
    expect(screen.getByText("Online")).toBeInTheDocument();
    expect(screen.getByText(/Chat on WhatsApp/i)).toBeInTheDocument();
    expect(screen.getByText(/Browse Projects/i)).toBeInTheDocument();
  });
});
