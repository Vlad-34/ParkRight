import styled from "styled-components";

/**
 * ButtonStyled is a styled component for the button.
 * It is a styled button element.
 * @returns ButtonStyled component
 */
export const ButtonStyled = styled.button`
  background-color: #50c878;
  padding: 0.5vw 1vw;
  margin-top: 2vw;
  margin-bottom: 2vw;
  font-size: 1.5vw;
  font-family: "Staatliches", sans-serif;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #98ff98;
  }
`;

/**
 *
 * @param content the content of the button
 * @param action the action to be performed when the button is clicked
 * @returns a button element
 */
const Button = ({
  content,
  action,
}: {
  content: string;
  action: () => void;
}) => {
  return <ButtonStyled onClick={action}>{content}</ButtonStyled>;
};

export default Button;
