import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mouseDownPos: [null, null],
  clickedPos: [null, null]
};

const threeCanvasClickSlice = createSlice({
  name: "threeCanvasClick",
  initialState,
  reducers: {
    setClickedPos(state, action) {
      state.clickedPos = action.payload
    },
    setMouseDownPos(state, action) {
      state.mouseDownPos = action.payload
    }
  },
});

export const {
  setClickedPos,
  setMouseDownPos
} = threeCanvasClickSlice.actions;

export default threeCanvasClickSlice.reducer;
