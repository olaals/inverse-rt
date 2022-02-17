import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counterSlice'
import sidebarSelectReducer from '../features/sidebarSelectSlice'
import colorReducer from '../features/colorSlice'
import initSubscriber from 'redux-subscriber';
import dummyReducer from '../features/dummySlice'
import selectedProjectReducer from '../features/selectedProjectSlice'
import settingsReducer from '../features/settingsSlice'
import displayReducer from '../features/displaySlice'
import threeCanvasClickSlice from '../features/threeCanvasClickSlice';
import selectPointSlice from '../features/selectPointSlice';

const store = configureStore({
  reducer: {
    "count": counterReducer,
    "selectedSidebar": sidebarSelectReducer,
    "color": colorReducer,
    "dummy": dummyReducer,
    "selectedProject": selectedProjectReducer,
    "settings": settingsReducer,
    "display": displayReducer,
    "threeCanvasClick": threeCanvasClickSlice,
    "selectPoint": selectPointSlice,
  },
})


const subscribe = initSubscriber(store)

const BACKEND_URL = 'http://127.0.0.1:5000'

export { store, subscribe, BACKEND_URL }

