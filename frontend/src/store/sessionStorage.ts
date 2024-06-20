import { RootState } from "./store";

export const loadState = () => {
  try {
    const serializedState = sessionStorage.getItem("state");

    if (serializedState === null) {
      return undefined;
    }

    return JSON.parse(serializedState);
  } catch (error) {
    return undefined;
  }
};

export const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem("state", serializedState);
  } catch (error) {
    alert("Failed to save state to sessionStorage.");
  }
};

export const deleteState = () => {
  try {
    sessionStorage.clear();
  } catch (error) {
    alert("Failed to delete state from sessionStorage.");
  }
};
