import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  projectName: '',
  projectIsSelected: false,
  showMesh: true,
  showPointcloud: false,
  pointcloudIsLoaded: false,
  selectedScan: -1,
  numScans: 0,
  cameraPos: [5, 5, 5],
}

const selectedProjectSlice = createSlice({
  name: "selectedProject",
  initialState,
  reducers: {
    setSelectedProject: (state, action) => {
      state.projectName = action.payload
      state.projectIsSelected = true
      state.showMesh = true
      state.showPointcloud = false
    },
    toggleShowMesh: (state) => {
      state.showMesh = !state.showMesh
    },
    togglePointcloud: (state) => {
      state.showPointcloud = !state.showPointcloud
    },
    onLoadPointcloud: (state, action) => {
      state.numScans = action.payload
      state.pointcloudIsLoaded = true
    },
    setSelectedScan: (state, action) => {
      state.selectedScan = action.payload
    },
    setCameraPos: (state, action) => {
      state.cameraPos = action.payload
    }

  }
})

export const {
  setSelectedProject,
  toggleShowMesh,
  togglePointcloud,
  onLoadPointcloud,
  setSelectedScan,
  setCameraPos,
} = selectedProjectSlice.actions
export default selectedProjectSlice.reducer