import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  other_idx: null,
  same_idx: null,
}

const selectNormalSlice = createSlice({
  name: "select_normal",
  initialState,
  reducers: {
    setSameAndOtherIdx: (state, action) => {
      state.same_idx = action.payload.same_idx
      state.other_idx = action.payload.other_idx
    }
  }
});

export const {
  setSameAndOtherIdx
} = selectNormalSlice.actions

export default selectNormalSlice.reducer