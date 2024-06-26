import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import axios, { AxiosError } from "axios";
import { selectDecodedToken } from "../../auth";
import { loadState } from "../../store/sessionStorage";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import app from "../../../firebase";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

export interface PredictState {
  prediction: "good" | "bad" | false;
}

const initialState: PredictState = {
  prediction: false,
};

/**
 * predict is an async thunk that sends an image to the server and receives a prediction.
 * @param image File object
 * @returns Promise of the prediction
 * @throws AxiosError
 * @async
 */
export const predict = createAsyncThunk(
  "predict/predict",
  async ({ image }: { image: File | null }) => {
    const formData = new FormData();
    if (image !== null) {
      formData.append("image", image);
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/predict/",
        formData,
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
 * savePrediction is an async thunk that saves a prediction to the server.
 * @param nickname string
 * @param imageFile File object
 * @returns Promise of the response data
 * @throws AxiosError
 * @async
 */
export const savePrediction = createAsyncThunk(
  "predict/savePrediction",
  async ({ nickname, imageFile }: { nickname: string; imageFile: File }) => {
    try {
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (user) {
        const userId = selectDecodedToken(loadState())?.user_id;
        const prediction = selectPredict(loadState());
        const storage = getStorage(app);
        const UUID = uuidv4();
        const imageRef = ref(storage, `images/${UUID}`);
        await uploadBytes(imageRef, imageFile);
        const response = await axios.post(
          "http://localhost:8000/image_map/",
          {
            nickname: nickname,
            user_id: userId,
            image_name: UUID,
            prediction: prediction,
            timestamp: new Date().toISOString(),
          },
          {
            headers: {
              Authorization: `Bearer ${loadState()?.auth.accessToken}`,
            },
          },
        );
        return response.data;
      } else {
        throw new AxiosError("User not logged in Firebase.");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        alert("Something went wrong: " + error.message);
      }
    }
  },
);

export const predictSlice = createSlice({
  name: "predict",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(predict.fulfilled, (state, action) => {
      state.prediction = action.payload?.predicted_class || "";
    });
  },
});

export const { clear } = predictSlice.actions;

export const selectPredict = (state: RootState) => state.predict.prediction;

export default predictSlice.reducer;
