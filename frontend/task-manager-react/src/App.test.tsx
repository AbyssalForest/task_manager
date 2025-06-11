import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App Component", () => {
  it("should render the main heading", () => {
    render(<App />);

    const headingElement = screen.getByText(/TaskMaster/i);
    expect(headingElement).toBeInTheDocument();
  });
});
