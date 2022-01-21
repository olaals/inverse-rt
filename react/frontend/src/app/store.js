import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counterSlice'
import sidebarSelectReducer from '../features/sidebarSelectSlice'
import colorReducer from '../features/colorSlice'
import initSubscriber from 'redux-subscriber';
import dummyReducer from '../features/dummySlice'
import selectedProjectReducer from '../features/selectedProjectSlice'

const store = configureStore({
  reducer: {
    "count": counterReducer,
    "selectedSidebar": sidebarSelectReducer,
    "color": colorReducer,
    "dummy": dummyReducer,
    "selectedProject": selectedProjectReducer
  },
})


const subscribe = initSubscriber(store)

const BACKEND_URL = 'http://127.0.0.1:5000'

export { store, subscribe, BACKEND_URL }
