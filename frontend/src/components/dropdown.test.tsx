import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-styled-components";
import CustomSelect from "./dropdown";

describe("CustomSelect Component", () => {
  it("renders CustomSelect and updates on selection", () => {
    const setValue = jest.fn(); // Mock function to replace setState

    const values = [
      { numValue: 1, strValue: "Option 1" },
      { numValue: 2, strValue: "Option 2" },
    ];

    // Initial value for the select component
    const value = 1;

    const { getByRole, getAllByRole } = render(
      <CustomSelect values={values} value={value} setValue={setValue} />,
    );

    // Open the select dropdown
    fireEvent.mouseDown(getByRole("combobox"));
    // Select the second option
    fireEvent.click(getAllByRole("option")[1]);

    // Check if setValue was called with the new value
    expect(setValue).toHaveBeenCalledWith(2);
  });
});
