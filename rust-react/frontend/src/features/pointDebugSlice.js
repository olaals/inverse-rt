import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  showVecTowardsLaserOrig: false,
  show_surface_normals: false,
}

const pointDebugSlice = createSlice({
  name: "pointDebug",
  initialState,
  reducers: {
    toggleShowVecTowardsLaserOrig: (state) => {
      state.showVecTowardsLaserOrig = !state.showVecTowardsLaserOrig
    },
    toggleShowSurfaceNormals(state) {
      state.show_surface_normals = !state.show_surface_normals
    },
  },
});

export const {
  toggleShowVecTowardsLaserOrig,
  toggleShowSurfaceNormals,
} = pointDebugSlice.actions

export default pointDebugSlice.reducer