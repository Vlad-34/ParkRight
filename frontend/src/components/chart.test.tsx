import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-styled-components";
import Chart from "./chart"; // Adjust the import path as necessary.

describe("Chart Component Tests", () => {
  const sampleData: { [key: string]: string | number }[] = [
    { timestamp: "2021-06-01", "2021-06-01 good": 10, "2021-06-01 bad": 5 },
    { timestamp: "2021-06-02", "2021-06-02 good": 7, "2021-06-02 bad": 3 },
  ];

  it("renders the chart component without crashing", () => {
    const { container } = render(<Chart data={sampleData} />);
    expect(container).toBeDefined();
  });

  it("includes correct timestamps on the XAxis", () => {
    const { getByText } = render(<Chart data={sampleData} />);
    expect(getByText("2021-06-01")).toBeInTheDocument();
    expect(getByText("2021-06-02")).toBeInTheDocument();
  });
});
