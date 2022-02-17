import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  index: null,
  from_scan: null,
  position: null
}

const selectPointSlice = createSlice({
  name: "selectPoint",
  initialState,
  reducers: {
    setIndex: (state, action) => {
      state.index = action.payload.index
      state.from_scan = action.payload.from_scan
      state.position = action.payload.position

    }
  }
});

export const {
  setIndex
} = selectPointSlice.actions

export default selectPointSlice.reducer