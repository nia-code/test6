import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DataProvider } from "../state/DataContext";
import Items from "../pages/Items";
import "@testing-library/jest-dom";

// Mock the global fetch function before each test to simulate API response
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          results: [{ id: 1, name: "Test Item", category: "Test", price: 100 }],
          total: 1,
          page: 1,
          limit: 10,
        }),
    })
  );
});

// Clean up mocks after each test to avoid interference between tests
afterEach(() => {
  global.fetch.mockClear();
});

// Test suite for the Items component
describe("Items Component", () => {
  it("renders loading initially and displays items", async () => {
    // Render the Items component within required context providers
    render(
      <MemoryRouter>
        <DataProvider>
          <Items />
        </DataProvider>
      </MemoryRouter>
    );

    // Assert that the loading text is shown initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for the mocked item to appear and assert its presence
    const item = await screen.findByText(/test item/i);
    expect(item).toBeInTheDocument();
  });
});
