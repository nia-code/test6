import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import Upload from "../pages/upload";
// Provides routing context for testing components that use React Router
import { MemoryRouter } from "react-router-dom";

// Test suite for the Upload component
describe("Upload Component", () => {
  // Test case to check if input fields are rendered and visible
  it("displays input fields and handles submit", () => {
    // Render the Upload component inside a router context
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Upload />
      </MemoryRouter>
    );

    // Query the DOM for the input fields using their placeholder text
    const nameInput = screen.getByPlaceholderText(/product name/i);
    const categoryInput = screen.getByPlaceholderText(/product category/i);
    const priceInput = screen.getByPlaceholderText(/product price/i);

    // Assert that each input is present in the document
    expect(nameInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
  });
});

it("submits form and calls fetch", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ id: 123 }) })
  );

  render(
    <MemoryRouter>
      <Upload />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText(/product name/i), {
    target: { value: "Test Product" },
  });
  fireEvent.change(screen.getByPlaceholderText(/product category/i), {
    target: { value: "Test Category" },
  });
  fireEvent.change(screen.getByPlaceholderText(/product price/i), {
    target: { value: "100" },
  });

  fireEvent.click(screen.getByText(/upload product/i));

  await screen.findByText(/upload product/i);
  expect(global.fetch).toHaveBeenCalledTimes(1);
});

it("shows error on failed fetch", async () => {
  global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

  render(
    <MemoryRouter>
      <Upload />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText(/product name/i), {
    target: { value: "Test Product" },
  });
  fireEvent.change(screen.getByPlaceholderText(/product category/i), {
    target: { value: "Test Category" },
  });
  fireEvent.change(screen.getByPlaceholderText(/product price/i), {
    target: { value: "100" },
  });

  fireEvent.click(screen.getByText(/upload product/i));

  await screen.findByText(/upload product/i);
  expect(global.fetch).toHaveBeenCalledTimes(1);
});
