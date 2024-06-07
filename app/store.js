import { configureStore } from '@reduxjs/toolkit'
import currentUserReducer from './slice/currentUserSlice'
 
export default configureStore({
  reducer: {
    currentUser: currentUserReducer
  },
})
