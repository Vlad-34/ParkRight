import Button from "../../components/button";
import Input from "../../components/input";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useState } from "react";
import {
  InputContainer,
  LinkBox,
  LinkContainer,
  LoginContainer,
} from "../styles/LoginStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import * as yup from "yup";
import {
  editProfile,
  createAccount,
  registerFirebase,
  selectUserData,
} from "../redux/authSlice";
import { FormFields } from "../../types/userTypes";

/**
 * RegisterPage is a React functional component that renders the RegisterPage page.
 * It uses the useForm, useNavigate, yup, yupResolver, useAppDispatch, useAppSelector, useState hooks.
 * It also uses the Input, Button components and the selectUserData, editProfile, createAccount, registerFirebase functions.
 * It renders a form that allows the user to register.
 * The form is validated using the yup library.
 * The form data is sent to the backend using the createAccount function.
 * The user is redirected to the login page after successful registration.
 * @param action - a string that specifies the action to be performed (register or edit)
 * @param schema - a yup schema that specifies the validation rules for the form
 * @returns RegisterPage component
 */
const RegisterPage = ({
  action,
  schema,
}: {
  action: string;
  schema: yup.ObjectSchema<
    {
      firstName?: string | null;
      lastName?: string | null;
      username?: string | null;
      email?: string | null;
      password?: string | null;
      confirm?: string | null;
    },
    yup.AnyObject,
    {
      firstName?: undefined | null;
      lastName?: undefined | null;
      username?: undefined | null;
      email?: undefined | null;
      password?: undefined | null;
      confirm?: undefined | null;
    },
    ""
  >;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user_data = useAppSelector(selectUserData);
  const [firstName, setFirstName] = useState<number | string>(
    action === "edit" ? (user_data ? user_data.first_name : "") : "",
  );
  const [lastName, setLastName] = useState<number | string>(
    action === "edit" ? (user_data ? user_data.last_name : "") : "",
  );
  const [username, setUsername] = useState<number | string>(
    action === "edit" ? (user_data ? user_data.username : "") : "",
  );
  const [email, setEmail] = useState<number | string>(
    action === "edit" ? (user_data ? user_data.email : "") : "",
  );
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
      if (action === "edit") {
        dispatch(
          editProfile({
            firstName,
            lastName,
            username,
            email,
            password,
          }),
        );
      } else {
        dispatch(
          createAccount({
            firstName,
            lastName,
            username,
            email,
            password,
          }),
        );
        dispatch(
          registerFirebase({
            email: email,
            password: password,
          }),
        );
      }

      navigate("/login");
    } catch (error) {
      alert(`${(error as AxiosError).message}`);
    }
  };

  return (
    <LoginContainer>
      <InputContainer>
        <Input
          register={register}
          fieldName="firstName"
          labelName="First Name"
          setValue={setFirstName}
          value={firstName}
        />
        {errors.firstName && <p>{errors.firstName.message as string}</p>}
        <Input
          register={register}
          fieldName="lastName"
          labelName="Last Name"
          setValue={setLastName}
          value={lastName}
        />
        {errors.lastName && <p>{errors.lastName.message as string}</p>}
        <Input
          register={register}
          fieldName="username"
          labelName="Username"
          setValue={setUsername}
          value={username}
        />
        {errors.username && <p>{errors.username.message as string}</p>}
        <Input
          register={register}
          fieldName="email"
          labelName="Email"
          setValue={setEmail}
          value={email}
        />
        {errors.email && <p>{errors.email.message as string}</p>}
        <Input
          register={register}
          fieldName="password"
          labelName="Password"
          setValue={setPassword}
          value={password}
        />
        {errors.password && <p>{errors.password.message as string}</p>}
        <Input
          register={register}
          fieldName="confirm"
          labelName="Confirm"
          setValue={setConfirm}
          value={confirm}
        />
        {errors.confirm && <p>{String(errors.confirm.message)}</p>}
      </InputContainer>
      <Button
        content={action === "edit" ? "Edit" : "Register"}
        action={handleSubmit(submit)}
      />
      {action !== "edit" && (
        <LinkContainer>
          <LinkBox flexDirection="left">
            Already have an account?&nbsp;<a href="/login">Login</a>
          </LinkBox>
          <LinkBox flexDirection="right">
            <a href="#">Forgot Password?</a>
          </LinkBox>
        </LinkContainer>
      )}
    </LoginContainer>
  );
};

export default RegisterPage;
