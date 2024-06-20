import Button from "../../components/button";
import Input from "../../components/input";
import { useAppDispatch } from "../../store/hooks";
import { useState } from "react";
import { login, loginFirebase } from "../redux";
import {
  InputContainer,
  LinkBox,
  LinkContainer,
  LoginContainer,
} from "../styles/LoginStyles";
import { useNavigate } from "react-router-dom";
import { loadState } from "../../store/sessionStorage";

/**
 *  LoginPage is a React functional component that renders the LoginPage page.
 * It uses the useAppDispatch, useNavigate hooks.
 * It also uses the login, loginFirebase functions.
 * It renders a form that allows the user to login.
 * The form data is sent to the backend using the login function.
 * The user is redirected to the home page after successful login.
 * @returns LoginPage component
 */
const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | number>("");
  const [password, setPassword] = useState<string | number>("");
  return (
    <LoginContainer>
      <InputContainer>
        <Input
          fieldName="username"
          labelName="Username"
          setValue={setUsername}
          value={username}
        />
        <Input
          fieldName="password"
          labelName="Password"
          setValue={setPassword}
          value={password}
        />
      </InputContainer>
      <Button
        content="Login"
        action={() => {
          dispatch(
            login({
              username: username.toString(),
              password: password.toString(),
            }),
          );
          dispatch(
            loginFirebase({
              email: loadState().auth.decodedToken.email,
              password: password.toString(),
            }),
          );
          navigate("/");
        }}
      />
      <LinkContainer>
        <LinkBox flexDirection="left">
          Already have an account?&nbsp;<a href="/register">Register</a>
        </LinkBox>
        <LinkBox flexDirection="right">
          <a href="/confirm-email">Forgot Password?</a>
        </LinkBox>
      </LinkContainer>
    </LoginContainer>
  );
};

export default LoginPage;
