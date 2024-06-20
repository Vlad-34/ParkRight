import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-styled-components";
import Input from "./input"; // Adjust the import path as necessary

describe("Input Component Tests", () => {
  it("renders Input with text type and updates its value on change", () => {
    const mockSetValue = jest.fn();
    const props = {
      labelName: "Username",
      fieldName: "username",
      setValue: mockSetValue,
      value: "",
    };

    render(<Input {...props} />);

    // Find the input and check if it is of type text
    const inputElement = screen.getByLabelText(props.labelName);
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("type", "text");

    // Simulate user typing into the input
    fireEvent.change(inputElement, { target: { value: "testuser" } });
    expect(mockSetValue).toHaveBeenCalledWith("testuser");
  });

  it("renders Input with password type correctly", () => {
    const mockSetValue = jest.fn();
    const props = {
      labelName: "Password",
      fieldName: "password",
      setValue: mockSetValue,
      value: "",
    };

    render(<Input {...props} />);

    // Find the input and check if it is of type password
    const inputElement = screen.getByLabelText(props.labelName);
    expect(inputElement).toHaveAttribute("type", "password");
  });
});
