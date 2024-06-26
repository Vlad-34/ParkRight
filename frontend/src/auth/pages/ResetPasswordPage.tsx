import Button from "../../components/button";
import Input from "../../components/input";
import { useAppDispatch } from "../../store/hooks";
import { useState } from "react";
import { InputContainer, LoginContainer } from "../styles/LoginStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm, UseFormRegister } from "react-hook-form";
import { AxiosError } from "axios";
import * as yup from "yup";
import { FormFields } from "../../types/userTypes";
import { resetPassword } from "..";

const schema = yup
  .object({
    firstName: yup.string().nullable(),
    lastName: yup.string().nullable(),
    username: yup.string().nullable(),
    email: yup.string().nullable(),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[\^$*.[\]{}()?\-"!@#%&/,><':;|_~`]/,
        "Password must contain at least one special character",
      )
      .notOneOf(
        [yup.ref("username"), null],
        "Password must not be the same as the username",
      ),
    confirm: yup
      .string()
      .required("Please confirm your password.")
      .oneOf([yup.ref("password")], "Passwords must match"),
  })
  .required();

/**
 * ResetPasswordPage is a React functional component that renders the ResetPasswordPage page.
 * It uses the useAppDispatch hook.
 * It also uses the resetPassword function.
 * It renders a form that allows the user to reset their password.
 * The form data is sent to the backend using the resetPassword function.
 * @returns ResetPasswordPage component
 */
const ResetPasswordPage = () => {
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState<number | string>("");
  const [confirm, setConfirm] = useState<number | string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submit: SubmitHandler<FormFields> = async () => {
    try {
      dispatch(
        resetPassword({
          password: password.toString(),
        }),
      );
    } catch (error) {
      alert(`${(error as AxiosError).message}`);
    }
  };

  return (
    <LoginContainer>
      <InputContainer>
        <Input
          value={password}
          register={register as UseFormRegister<FormFields>}
          fieldName="password"
          labelName="Password"
          setValue={setPassword}
        />
        {errors.password && <p>{errors.password.message as string}</p>}
        <Input
          value={confirm}
          register={register as UseFormRegister<FormFields>}
          fieldName="confirm"
          labelName="Confirm"
          setValue={setConfirm}
        />
        {errors.confirm && <p>{String(errors.confirm.message)}</p>}
      </InputContainer>
      <Button content="Register" action={handleSubmit(submit)} />
    </LoginContainer>
  );
};

export default ResetPasswordPage;
