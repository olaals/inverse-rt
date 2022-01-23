import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  meshOpacity: 100,
  sceneBackgroundColor: '#ffffff',
  pointcloudSize: 500,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setMeshOpacity(state, action) {
      state.meshOpacity = action.payload;
    },
    setSceneBackgroundColor(state, action) {
      state.sceneBackgroundColor = action.payload;
    },
    setPointcloudSize(state, action) {
      state.pointcloudSize = action.payload;
    }
  },
});

export const {
  setMeshOpacity,
  setSceneBackgroundColor,
  setPointcloudSize,
} = settingsSlice.actions;

export default settingsSlice.reducer;
