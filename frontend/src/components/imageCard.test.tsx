import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-styled-components";
import ImageCard from "./imageCard"; // Adjust the import path as necessary

describe("ImageCard Component", () => {
  const props = {
    imageUrl: "https://example.com/sample.jpg",
    timestamp: "2021-08-01",
    prediction: "Likely",
  };

  it("renders ImageCard with correct content", () => {
    render(<ImageCard {...props} />);
    screen.debug();

    // Check if the image is rendered with the correct URL
    const image = screen.getByRole("img");
    expect(image).toHaveStyle(`background-image: url(${props.imageUrl})`);

    // Check if the prediction is rendered
    const prediction = screen.getByText(props.prediction);
    expect(prediction).toBeInTheDocument();

    // Check if the timestamp is rendered
    const timestamp = screen.getByText(props.timestamp);
    expect(timestamp).toBeInTheDocument();
  });
});
