import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0
}

const dummySlice = createSlice({
  name: "dummy1",
  initialState,
  reducers: {
    setDummyValue: (state, action) => {
      state.value = action.payload
    }
  }
});

export const {
  setDummyValue,
} = dummySlice.actions
export default dummySlice.reducer