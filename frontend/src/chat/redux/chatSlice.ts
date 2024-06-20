import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import axios, { AxiosError } from "axios";
import { loadState } from "../../store/sessionStorage";
import { Message, User } from "../../types/userTypes";
import { selectDecodedToken } from "../../auth";

export interface ChatState {
  messages: Message[];
  users: User[];
}

const initialState: ChatState = {
  users: [],
  messages: [],
};

/**
 * sendMessage is an async thunk that sends a message to the server.
 * @param websocket WebSocket object
 * @param message Message object
 * @returns Promise of the messages
 * @throws AxiosError
 * @async
 */
export const sendMessage = createAsyncThunk(
  "chat/send",
  async ({
    websocket,
    message,
  }: {
    websocket?: WebSocket | null;
    message?: Message | null;
  }) => {
    try {
      websocket?.send(JSON.stringify(message));
      return [...loadState().chat.messages, message];
    } catch (error) {
      if (error instanceof AxiosError) {
        alert("Something went wrong: " + error.message);
      }
    }
  },
);

/**
 * getMessages is an async thunk that fetches the messages from the server.
 * @returns Promise of the messages
 * @throws alert with error message
 * @async
 */
export const getMessages = createAsyncThunk("chat/receive", async () => {
  try {
    const decodedToken = selectDecodedToken(loadState());
    const userId = decodedToken?.user_id;
    const response = await axios.get(`http://localhost:8000/chat/${userId}`, {
      headers: {
        Authorization: `Bearer ${loadState()?.auth.accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      alert("Something went wrong: " + error.message);
    }
  }
});

/**
 * getUsers is an async thunk that fetches the users from the server.
 * @returns Promise of the users
 * @throws alert with error message
 * @async
 */

export const getUsers = createAsyncThunk("chat/getUsers", async () => {
  try {
    const decodedToken = selectDecodedToken(loadState());
    const userId = decodedToken?.user_id;
    const response = await axios.get(
      `http://localhost:8000/user/${userId}/users`,
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
});

/**
 * setMessages is an async thunk that sets the messages in the server.
 * @param data Message object
 * @returns Promise of the messages
 * @throws AxiosError
 * @async
 */
export const setMessages = createAsyncThunk(
  "chat/setMessages",
  async (data: Message) => {
    console.log(data);
    try {
      return [...loadState().chat.messages, data];
    } catch (error) {
      if (error instanceof AxiosError) {
        alert("Something went wrong: " + error.message);
      }
    }
  },
);

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages = action.payload ?? [];
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
      .addCase(setMessages.fulfilled, (state, action) => {
        state.messages = action.payload ?? [];
      });
  },
});

export const { clear } = chatSlice.actions;

export const selectMessages = (state: RootState) => state.chat.messages;
export const selectUsers = (state: RootState) => state.chat.users;

export default chatSlice.reducer;
