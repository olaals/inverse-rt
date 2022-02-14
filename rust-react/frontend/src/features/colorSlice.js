import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: '#ff0000',
}

const colorSlice = createSlice({
  name: "color",
  initialState,
  reducers: {
    setColor: (state, action) => {
      console.log("setColor", action.payload)
      state.value = action.payload
    }
  }
});

export const {
  setColor,
} = colorSlice.actions

export default colorSlice.reducer