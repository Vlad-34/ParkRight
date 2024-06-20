import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { ImageMap } from "../../types/userTypes";
import axios, { AxiosError } from "axios";
import { loadState } from "../../store/sessionStorage";
import app from "../../../firebase";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { getAuth } from "firebase/auth";

export interface StatisticsState {
  imageMaps: ImageMap[];
  images: (string | undefined)[];
}

const initialState: StatisticsState = {
  imageMaps: [],
  images: [],
};

/**
 *
 * @param UUID UUID of the image
 * @returns URL of the image
 */
export const getImage = async (UUID: string) => {
  try {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (user) {
      const storage = getStorage(app);
      const imageRef = ref(storage, `images/${UUID}`);
      const url = await getDownloadURL(imageRef);
      return url;
    } else {
      throw new Error("User not logged in Firebase.");
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * getImages is an async thunk that fetches the images of the image maps.
 * @param data ImageMap[]
 * @returns Promise of the images
 */
export const getImages = createAsyncThunk(
  "statistics/getImages",
  async (data: ImageMap[]) => {
    const images = await Promise.all(
      data.map((element) => getImage(element.image))
    );
    return images;
  }
);

/**
 * getStatistics is an async thunk that fetches the statistics of the image maps.
 * @param value string
 * @param id number
 * @param time string
 * @returns Promise of the statistics
 * @throws alert with error message
 * @async
 */
export const getStatistics = createAsyncThunk(
  "statistics/getStatistics",
  async ({ value, id, time }: { value: string; id: number; time: string }) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/image_map/${value}/${id}/${time}`,
        {
          headers: {
            Authorization: `Bearer ${loadState()?.auth.accessToken}`,
          },
        }
      );
      getImages(response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        alert("Something went wrong: " + error.message);
      }
    }
  }
);

export const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStatistics.fulfilled, (state, action) => {
        state.imageMaps = action.payload;
      })
      .addCase(getImages.fulfilled, (state, action) => {
        state.images = action.payload ? action.payload : [];
      });
  },
});

export const { clear } = statisticsSlice.actions;

export const selectStatistics = (state: RootState) =>
  state.statistics.imageMaps;
export const selectImages = (state: RootState) => state.statistics.images;

export default statisticsSlice.reducer;
