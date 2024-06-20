import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-styled-components";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./navbar"; // Adjust the import path as necessary

describe("Navbar Component Tests", () => {
  const buttonContent = [
    { content: "Home", linkTo: "/", image: "/images/home_icon.png" },
    { content: "About", linkTo: "/about", image: "/images/about_icon.png" },
  ];

  it("renders Navbar and checks links and buttons", () => {
    render(
      <Router>
        <Navbar buttonContent={buttonContent} />
      </Router>,
    );

    // Check if the logo image is rendered
    const logoImage = screen.getByRole("img", { name: "" });
    expect(logoImage).toBeInTheDocument();

    // Check if all Navbar buttons are rendered
    buttonContent.forEach((item) => {
      const button = screen.getByText(item.content);
      expect(button).toBeInTheDocument();
      expect(button.closest("a")).toHaveAttribute("href", item.linkTo);
    });

    // Check responsive handling of the button content
    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});
