import RegisterPage from "./RegisterPage";
import * as yup from "yup";

/**
 * Schema for the registration form.
 * The schema is used to validate the form data.
 * The schema is created using the yup library.
 */
const schema = yup
  .object({
    firstName: yup.string().required("First name is required."),
    lastName: yup.string().required("Last name is required."),
    username: yup.string().required("Username is required."),
    email: yup
      .string()
      .email("Email must be valid.")
      .required("Email is required."),
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
 * CreateAccountPage is a React functional component that renders the CreateAccountPage page.
 * It uses the RegisterPage component and the schema.
 * It renders a form that allows the user to create an account.
 * The form data is sent to the backend using the createAccount function.
 * @returns CreateAccountPage component
 */
const CreateAccountPage = () => {
  return <RegisterPage action="register" schema={schema} />;
};

export default CreateAccountPage;
