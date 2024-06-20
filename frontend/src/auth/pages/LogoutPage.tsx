import { useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import { clear } from "../redux";

/**
 * LogoutPage is a React functional component that logs the user out.
 * It uses the useAppDispatch and useNavigate hooks.
 * It also uses the clear function.
 * It clears the user data from the store and redirects the user to the home page.
 * It does not render any UI elements.
 * @returns LogoutPage component
 */
const LogoutPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(clear());
    navigate("/");
  }, [dispatch, navigate]);
  return null;
};

export default LogoutPage;
