import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cameraPos: [0, 0, 0],
};

const threeSlice = createSlice({
  name: "three",
  initialState,
  reducers: {},
});

export const { } = threeSlice.actions;

export default threeSlice.reducer;
