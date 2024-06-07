import { createSlice } from '@reduxjs/toolkit'
 
export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState: {
    value: { firstName: 'John', lastName: "Doe", username: "j_doe", email: "john.doe@gmail.com" },
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.value = action.payload
    },
  },
})
 
export const { setCurrentUser } = currentUserSlice.actions
 
export default currentUserSlice.reducer