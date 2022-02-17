import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  index: null,
}

const selectPointSlice = createSlice({
  name: "selectPoint",
  initialState,
  reducers: {
    setIndex: (state, action) => {
      state.index = action.payload
    }
  }
});

export const {
  setIndex
} = selectPointSlice.actions

export default selectPointSlice.reducer