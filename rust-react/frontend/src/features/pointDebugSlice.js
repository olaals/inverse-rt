import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  showVecTowardsLaserOrig: false,
  show_surface_normals: false,
  show_ind_surface_normals: false,
  num_surface_normals: 0,
  selected_surface_normal: -1,
  selected_other_idx: null,
  selected_same_idx: null,
  normals: [],
  same_pts: [],
  other_pts: [],
  same_idx: [],
  other_idx: [],
}

const pointDebugSlice = createSlice({
  name: "pointDebug",
  initialState,
  reducers: {
    toggleShowVecTowardsLaserOrig: (state) => {
      state.showVecTowardsLaserOrig = !state.showVecTowardsLaserOrig;
    },
    toggleShowSurfaceNormals(state) {
      state.show_surface_normals = !state.show_surface_normals;
    },
    toggleShowIndSurfaceNormals(state) {
      state.show_ind_surface_normals = !state.show_ind_surface_normals;
    },
    setNumSurfaceNormals(state, action) {
      console.log("action setNumSurfaceNormals", action.payload)
      state.num_surface_normals = action.payload;
    },
    setSelectedSurfaceNormal(state, action) {
      console.log("action setSelectedSurfaceNormal", action.payload)
      state.selected_surface_normal = action.payload;
    },
    setNormalsSameAndOtherPts(state, action) {
      state.normals = action.payload.normals;
      state.same_pts = action.payload.same_pts;
      state.other_pts = action.payload.other_pts;
      state.same_idx = action.payload.same_idx;
      state.other_idx = action.payload.other_idx;
    },
    setSameOtherNormalIdx(state, action) {
      state.selected_same_idx = action.payload.same_idx;
      state.selected_other_idx = action.payload.other_idx;
    }

  }
});

export const {
  toggleShowVecTowardsLaserOrig,
  toggleShowSurfaceNormals,
  toggleShowIndSurfaceNormals,
  setNumSurfaceNormals,
  setSelectedSurfaceNormal,
  setNormalsSameAndOtherPts,
  setSameOtherNormalIdx,
} = pointDebugSlice.actions

export default pointDebugSlice.reducer