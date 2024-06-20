import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./home";
import { EditProfilePage, PredictPage } from "./client";
import { ChatPage } from "./chat";
import { LoginPage, refresh, selectDecodedToken } from "./auth";
import { StatisticsPage } from "./admin";
import Navbar from "./components/navbar";
import { createGlobalStyle } from "styled-components";
import { Provider } from "react-redux";
import { store } from "./store/store";
import CreateAccountPage from "./auth/pages/CreateAccount";
import LogoutPage from "./auth/pages/LogoutPage";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "./store/hooks";
import ConfirmEmailPage from "./auth/pages/ConfirmEmailPage";
import ResetPasswordPage from "./auth/pages/ResetPasswordPage";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Staatliches', sans-serif;
    color: #1E1E1E;
    overFlow-x: hidden;
  }
`;

function SubApp() {
  const jwtPayload = useSelector(selectDecodedToken);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(refresh());
    }, 300000);

    return () => {
      clearInterval(interval);
    };
  }, [dispatch]);

  const contents = [
    { content: "Home", linkTo: "/", image: "/images/home.png" },
    !jwtPayload?.is_staff
      ? {
          content: "Park Scooter",
          linkTo: "/predict",
          image: "/images/data-analysis.png",
        }
      : null,
    jwtPayload?.is_staff
      ? {
          content: "Statistics",
          linkTo: "/statistics",
          image: "/images/statistics.png",
        }
      : null,
    { content: "Chat", linkTo: "/chat", image: "/images/chat.png" },
    {
      content: "Edit Profile",
      linkTo: "/edit-profile",
      image: "/images/user-avatar.png",
    },
    !jwtPayload?.user_id
      ? { content: "Login", linkTo: "/login", image: "/images/enter.png" }
      : {
          content: "Logout",
          linkTo: "/logout",
          image: "/images/logout.png",
        },
  ]
    .filter(Boolean)
    .reverse();

  return (
    <BrowserRouter>
      <Navbar buttonContent={contents.filter(Boolean) as []} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {!jwtPayload?.is_staff && (
          <Route path="/predict" element={<PredictPage />} />
        )}
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        {!jwtPayload?.is_staff && (
          <Route path="/register" element={<CreateAccountPage />} />
        )}
        <Route path="/edit-profile" element={<EditProfilePage />} />
        {jwtPayload?.is_staff && (
          <Route path="/statistics" element={<StatisticsPage />} />
        )}
        <Route path="/confirm-email" element={<ConfirmEmailPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <link
        href="https://fonts.googleapis.com/css?family=Staatliches"
        rel="stylesheet"
      ></link>
      <GlobalStyle />
      <SubApp />
    </Provider>
  );
}

export default App;
