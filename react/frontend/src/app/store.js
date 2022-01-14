import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counterSlice'
import sidebarSelectReducer from '../features/sidebarSelectSlice'

export const store = configureStore({
  reducer: {
    "count": counterReducer,
    "selectedSidebar": sidebarSelectReducer
  },
})