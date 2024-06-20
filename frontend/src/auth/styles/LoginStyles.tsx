import styled from "styled-components";

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10vh;
  margin-left: ${window.innerWidth > 600 ? "15vw" : 0};
  margin-right: ${window.innerWidth > 600 ? "15vw" : 0};
  box-shadow: ${window.innerWidth > 600
    ? "0 0 10px 0 rgba(0, 0, 0, 0.1)"
    : "0"};
  & input {
    width: ${window.innerWidth > 600 ? "40vw" : "60vw"};
    height: ${window.innerWidth > 600 ? "3vh" : "2.5vh"};
    margin-left: 1vw;
    margin-top: 2vh;
  }
  & button {
    margin-top: 5vw;
    width: ${window.innerWidth > 600 ? "48.7vw" : "78vw"};
    ${window.innerWidth < 600 ? "height: 3vh; font-size: 4vw" : ""};
  }
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 3vw;
`;

export const LinkContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 2vw;
  margin-bottom: 5vw;
`;

export const LinkBox = styled.div<{ flexDirection: string }>`
  display: flex;
  flex-direction: ${(props) =>
    props.flexDirection == "left" ? "row" : "row-reverse"};
  width: ${window.innerWidth > 600 ? "24vw" : "39vw"};
  font-size: ${window.innerWidth > 600 ? "1.5vw" : "2vw"};
`;
