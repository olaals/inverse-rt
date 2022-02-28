import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  pointcloud: [],


}

const pointcloudSlice = createSlice({
  name: "pointcloudSlice",
  initialState,
  reducers: {
    setPointcloud: (state, action) => {
      state.pointcloud = action.payload
    }
  }
});

export const {
  setPointcloud
} = pointcloudSlice.actions

export default pointcloudSlice.reducer