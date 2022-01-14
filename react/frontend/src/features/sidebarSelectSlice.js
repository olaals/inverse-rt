import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0
}

const sidebarSelectSlice = createSlice({
  name: "sidebarSelect",
  initialState,
  reducers: {
    selectSidebar(state, action) {
      state.value = action.payload
    }
  }
});

export const { selectSidebar } = sidebarSelectSlice.actions

export default sidebarSelectSlice.reducer