import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  showVecTowardsLaserOrig: false,
}

const pointDebugSlice = createSlice({
  name: "pointDebug",
  initialState,
  reducers: {
    toggleShowVecTowardsLaserOrig: (state) => {
      state.showVecTowardsLaserOrig = !state.showVecTowardsLaserOrig
    }
  }
});

export const {
  toggleShowVecTowardsLaserOrig,
} = pointDebugSlice.actions

export default pointDebugSlice.reducer