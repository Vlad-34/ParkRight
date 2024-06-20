import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.nav`
  background-color: #50c878;
  padding: 10px;
  display: flex;
`;

const NavbarLogoContainer = styled.div`
  display: flex;
  padding-left: 0.5vw;
  width: ${window.innerWidth > 600 ? "48.5vw" : "43vw"};
  align-items: center;
  flex-direction: row;
  & > img {
    max-width: 10vw;
  }
`;

const NavbarButtonContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: flex-end;
  width: 50vw;
`;

const NavbarButton = styled.button`
  background-color: transparent;
  border: none;
  padding: 0.5vw 1vw;
  margin-right: 2vw;
  cursor: pointer;
  font-size: 1.7vw;
  font-family: "Staatliches", sans-serif;
  white-space: nowrap;
  &:hover {
    background-color: #98ff98;
  }
`;

/**
 * Interface for the content of the buttons to be displayed in the navbar
 * @param content { string } content of the button
 * @param linkTo { string } link to which the button should navigate
 * @param image { string } image to be displayed in the button
 * @returns an interface for the content of the buttons to be displayed in the navbar
 */
interface NavbarButtonContent {
  content: string;
  linkTo: string;
  image: string;
}

/**
 * Navbar component to display the navbar
 * It uses the styled-components library to style the navbar
 * @param buttonContent { NavbarButtonContent[] } content of the buttons to be displayed in the navbar
 * @returns a navbar component
 */
const Navbar = ({
  buttonContent,
}: {
  buttonContent: NavbarButtonContent[];
}) => {
  return (
    <Container>
      <Link to="/">
        <NavbarLogoContainer>
          {window.innerWidth > 600 ? (
            <img src="/images/logo.png" />
          ) : (
            <img src="/images/logo_responsive.png" />
          )}
        </NavbarLogoContainer>
      </Link>
      <NavbarButtonContainer>
        {buttonContent.map((button) => (
          <Link to={button?.linkTo}>
            <NavbarButton>
              {window.innerWidth > 600 ? (
                button?.content
              ) : (
                <img width="25vw" src={button.image} />
              )}
            </NavbarButton>
          </Link>
        ))}
      </NavbarButtonContainer>
    </Container>
  );
};

export default Navbar;
