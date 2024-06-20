import Button from "../../components/button";
import Input from "../../components/input";
import { useAppDispatch } from "../../store/hooks";
import { useState } from "react";
import { InputContainer, LoginContainer } from "../styles/LoginStyles";
import { sendConfirmationEmail } from "../redux";

/**
 * ConfirmEmailPage is a React functional component that renders the ConfirmEmailPage page.
 * It uses the useAppDispatch hook.
 * It also uses the sendConfirmationEmail function.
 * It renders a form that allows the user to confirm their email.
 * The form data is sent to the backend using the sendConfirmationEmail function.
 * @returns ConfirmEmailPage component
 */
const ConfirmEmailPage = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState<number | string>("");

  return (
    <LoginContainer>
      <InputContainer>
        <Input
          value={email}
          fieldName="email"
          labelName="Confirm Email"
          setValue={setEmail}
        />
      </InputContainer>
      <Button
        content="Confirm Email"
        action={() => {
          dispatch(
            sendConfirmationEmail({
              email: email.toString(),
            }),
          );
        }}
      />
    </LoginContainer>
  );
};

export default ConfirmEmailPage;
