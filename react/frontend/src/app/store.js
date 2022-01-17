import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counterSlice'
import sidebarSelectReducer from '../features/sidebarSelectSlice'
import colorReducer from '../features/colorSlice'
import initSubscriber from 'redux-subscriber';
import dummyReducer from '../features/dummySlice'

const store = configureStore({
  reducer: {
    "count": counterReducer,
    "selectedSidebar": sidebarSelectReducer,
    "color": colorReducer,
    "dummy": dummyReducer
  },
})


const subscribe = initSubscriber(store)

export { store, subscribe }

