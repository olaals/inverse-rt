import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  projectName: '',
  projectIsSelected: false,
  showMesh: true,
}

const selectedProjectSlice = createSlice({
  name: "selectedProject",
  initialState,
  reducers: {
    setSelectedProject: (state, action) => {
      state.projectName = action.payload
      state.projectIsSelected = true
      state.showMesh = true
    },
    toggleShowMesh: (state) => {
      console.log("toggleShowMesh", state.showMesh)
      state.showMesh = !state.showMesh
    }
  }
});

export const {
  setSelectedProject,
  toggleShowMesh,

} = selectedProjectSlice.actions
export default selectedProjectSlice.reducer