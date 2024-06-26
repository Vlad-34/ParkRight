import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { jwtDecode } from "jwt-decode";
import { ExtendedJwtPayload, User } from "../../types/userTypes";
import axios, { AxiosError } from "axios";
import { loadState } from "../../store/sessionStorage";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import app from "../../../firebase";
import { useSelector } from "react-redux";

export interface AuthState {
  accessToken?: string;
  refreshToken?: string;
  decodedToken?: ExtendedJwtPayload | null;
  user_data?: User | null;
}

const initialState: AuthState = {
  decodedToken: null,
  accessToken: "",
  refreshToken: "",
};

/**
 * registerFirebase is an async thunk that registers the user in the firebase.
 * @param email email of the user
 * @param password password of the user
 * @returns Promise of the registration
 * @throws alert with error message
 * @async
 */
export const registerFirebase = createAsyncThunk(
  "auth/registerFirebase",
  async ({
    email,
    password,
  }: {
    email: number | string;
    password: number | string;
  }) => {
    try {
      const auth = getAuth(app);
      console.log(auth);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.toString()!,
        password.toString()!,
      );
      return userCredential;
    } catch (error) {
      if (error instanceof AxiosError) {
        alert("Something went wrong: " + error.message);
      }
    }
  },
);

/**
 * loginFirebase is an async thunk that logs the user int the firebase.
 * @param email email of the user
 * @param password password of the user
 * @returns Promise of the login
 * @throws alert with error message
 * @async
 */
export const loginFirebase = createAsyncThunk(
  "auth/loginFirebase",
  async ({ email, password }: { email?: string | null; password?: string }) => {
    try {
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email!,
        password!,
      );
      setPersistence(auth, browserSessionPersistence);
      return userCredential;
    } catch (error) {
      if (error instanceof AxiosError) {
        alert("Something went wrong: " + error.message);
      }
    }
  },
);

/**
 * createAccount is an async thunk that creates an account for the user.
 * @param firstName first name of the user
 * @param lastName last name of the user
 * @param username username of the user
 * @param email email of the user
 * @param password password of the user
 * @returns Promise of the account creation
 * @throws alert with error message
 * @async
 */
export const createAccount = createAsyncThunk(
  "auth/register",
  async ({
    firstName,
    lastName,
    username,
    email,
    password,
  }: {
    firstName?: number | string | null;
    lastName?: number | string | null;
    username?: number | string | null;
    email?: number | string | null;
    password?: number | string | null;
  }) => {
    try {
      const response = await axios.post("http://localhost:8000/user/register", {
        first_name: firstName,
        last_name: lastName,
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        alert("Something went wrong: " + error.message);
      }
    }
  },
);

/**
 * login is an async thunk that logs the user in.
 * @param username username of the user
 * @param password password of the user
 * @returns Promise of the login
 * @throws alert with error message
 * @async
 */
export const login = createAsyncThunk(
  "auth/login",
  async ({
    username,
    password,
  }: {
    username?: string | null;
    password?: string | null;
  }) => {
    try {
      if (!!username && !!password) {
        const response = await axios.post("http://localhost:8000/auth/token", {
          username,
          password,
        });
        return response.data;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        alert("Something went wrong: " + error.message);
      }
    }
  },
);

/**
 * refresh is an async thunk that refreshes the token.
 * @returns Promise of the refresh
 * @throws alert with error message
 * @async
 */
export const refresh = createAsyncThunk("auth/refresh", async () => {
  try {
    const refreshToken = useSelector(selectRefreshToken);
    if (refreshToken) {
      const response = await axios.post(
        "http://localhost:8000/auth/token/refresh",
        {
          refresh: refreshToken,
        },
      );
      return response.data;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      alert("Something went wrong: " + error.message);
    }
  }
});

/**
 * getProfile is an async thunk that fetches the profile of the user.
 * @returns Promise of the profile
 * @throws alert with error message
 * @async
 */
export const getProfile = createAsyncThunk("user/getProfile", async () => {
  try {
    const decodedToken = selectDecodedToken(loadState());
    const userId = decodedToken?.user_id;
    const response = await axios.get(`http://localhost:8000/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${loadState()?.auth.accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error && axios.isAxiosError(error)) {
      alert(error.code + " " + error.message);
    }
  }
});

/**
 * editProfile is an async thunk that edits the profile of the user.
 * @param firstName first name of the user
 * @param lastName last name of the user
 * @param username username of the user
 * @param email email of the user
 * @param password password of the user
 * @returns Promise of the profile edit
 * @throws alert with error message
 * @async
 */
export const editProfile = createAsyncThunk(
  "user/editProfile",
  async ({
    firstName,
    lastName,
    username,
    email,
    password,
  }: {
    firstName?: number | string | null;
    lastName?: number | string | null;
    username?: number | string | null;
    email?: number | string | null;
    password?: number | string | null;
  }) => {
    try {
      const decodedToken = selectDecodedToken(loadState());
      const userId = decodedToken?.user_id;
      const response = await axios.patch(
        `http://localhost:8000/user/${userId}`,
        {
          first_name: firstName,
          last_name: lastName,
          username,
          email,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${loadState()?.auth.accessToken}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        alert("Something went wrong: " + error.message);
      }
    }
  },
);

/**
 * sendConfirmationEmail is an async thunk that sends a confirmation email to the user.
 * @param email email of the user
 * @returns Promise of the email
 * @throws alert with error message
 * @async
 */
export const sendConfirmationEmail = createAsyncThunk(
  "auth/sendConfirmationEmail",
  async ({ email }: { email: string }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/auth/send-confirmation-email",
        {
          email,
        },
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        alert("Something went wrong: " + error.message);
      }
    }
  },
);

/**
 * confirmEmail is an async thunk that confirms the email of the user.
 * @param password password of the user
 * @returns Promise of the email confirmation
 * @throws alert with error message
 * @async
 */
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ password }: { password: string }) => {
    try {
      const email = new URLSearchParams(window.location.search).get("email");
      const response = await axios.post(
        "http://localhost:8000/auth/reset-password",
        {
          email,
          password,
        },
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        alert("Something went wrong: " + error.message);
      }
    }
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.decodedToken = jwtDecode(action.payload?.access || "");
        state.accessToken = action.payload?.access || "";
        state.refreshToken = action.payload?.refresh || "";
      })
      .addCase(refresh.fulfilled, (state, action) => {
        state.decodedToken = jwtDecode(action.payload?.access || "");
        state.accessToken = action.payload?.access || "";
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user_data = action.payload;
      });
  },
});

export const { clear } = authSlice.actions;

export const selectDecodedToken = (state: RootState) => state.auth.decodedToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
export const selectUserId = (state: RootState) =>
  state.auth.decodedToken?.user_id;
export const selectUserData = (state: RootState) => state.auth.user_data;

export default authSlice.reducer;
