import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { LanguageProvider } from "../context/LanguageContext";
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

describe("VirtualAssistant component", () => {
  it("renders assistant stage and toggle button", () => {
    render(
      <LanguageProvider>
        <VirtualAssistant />
      </LanguageProvider>
    );

    const toggleBtn = screen.getByTitle("Minimizar asistente");
    expect(toggleBtn).toBeInTheDocument();
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
});
