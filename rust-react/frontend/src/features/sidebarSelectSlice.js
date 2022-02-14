import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0,
  viewThreeWin: true
}

const sidebarSelectSlice = createSlice({
  name: "sidebarSelect",
  initialState,
  reducers: {
    selectSidebar(state, action) {
      state.value = action.payload
    },
    setViewThreeWin(state, action) {
      state.viewThreeWin = action.payload
    }
  }
});

export const {
  selectSidebar,
  setViewThreeWin
} = sidebarSelectSlice.actions

export default sidebarSelectSlice.reducer