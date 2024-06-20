import { useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";
import RegisterPage from "./RegisterPage";
import * as yup from "yup";
import { getProfile } from "..";

/**
 * Schema for the registration form.
 * The schema is used to validate the form data.
 * The schema is created using the yup library.
 */
const schema = yup.object({
  firstName: yup.string().nullable(),
  lastName: yup.string().nullable(),
  username: yup.string().nullable(),
  email: yup
    .string()
    .nullable()
    .test("email", "Email must be valid.", (val) => {
      if (val == null || val === "") return true;
      return yup.string().email().isValidSync(val);
    }),
  password: yup
    .string()
    .nullable()
    .test("password", "Password must meet the criteria.", (val) => {
      if (val == null || val === "") return true;
      return yup
        .string()
        .min(8, "Password must be at least 8 characters long")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(
          /[\^$*.[\]{}()?\-"!@#%&/,><':;|_~`]/,
          "Password must contain at least one special character",
        )
        .isValidSync(val);
    }),
  confirm: yup
    .string()
    .nullable()
    .test("confirm", "Passwords must match", (val, context) => {
      if (val == null || val === "") return true;
      return val === context.parent.password;
    }),
});

/**
 * EditProfilePage is a React functional component that renders the EditProfilePage page.
 * It uses the useAppDispatch hook.
 * It also uses the getProfile function.
 * It renders a form that allows the user to edit their profile.
 * The form data is sent to the backend using the editProfile function.
 * The user is redirected to the home page after successful profile update.
 * @returns EditProfilePage component
 */
const EditProfilePage = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);
  return <RegisterPage action="edit" schema={schema} />;
};

export default EditProfilePage;
