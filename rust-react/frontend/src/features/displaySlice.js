import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  displayThreeWin: true,
  displayScanWin: false,
};

const displaySlice = createSlice({
  name: "display",
  initialState,
  reducers: {
    setDisplayThreeWin(state, action) {
      state.displayThreeWin = action.payload;
    },
    setDisplayScanWin(state, action) {
      state.displayScanWin = action.payload;
    }
  },
});

export const {
  setDisplayThreeWin,
  setDisplayScanWin,
} = displaySlice.actions;

export default displaySlice.reducer;
