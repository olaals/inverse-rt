import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showThreeWin: true,
  htmlRef: null,
};

const viewSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    setShowThreeWin(state, action) {
      state.showThreeWin = action.payload;
    },
    setHtmlRef(state, action) {
      state.htmlRef.canvas = action.payload.canvas
      state.htmlRef.container = action.payload.container
    }
  },
});

export const {
  setShowThreeWin,
  setHtmlRef,
} = viewSlice.actions;

export default viewSlice.reducer;
