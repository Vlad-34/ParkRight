import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-styled-components";
import Button from "./button";

describe("Button Component Tests", () => {
  // Test to check if the button renders correctly with given content
  it("renders the button with the correct text", () => {
    render(<Button content="Click me!" action={() => {}} />);
    const buttonElement = screen.getByText("Click me!");
    expect(buttonElement).toBeInTheDocument();
  });

  // Test to verify that the button's onClick action works as expected
  it("calls the correct action on click", () => {
    const mockAction = jest.fn();
    render(<Button content="Click me!" action={mockAction} />);
    const buttonElement = screen.getByText("Click me!");
    fireEvent.click(buttonElement);
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  // Optional: Test to check the hover state color change
  it("changes background color on hover", () => {
    render(<Button content="Hover over me" action={() => {}} />);
    const buttonElement = screen.getByText("Hover over me");
    fireEvent.mouseOver(buttonElement);
    expect(buttonElement).toHaveStyle(`background-color: #98ff98`);
  });
});
