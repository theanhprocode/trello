import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  onlineUserIds: []
}

export const onlineUsersSlice = createSlice({
  name: 'onlineUsers',
  initialState,
  reducers: {
    updateOnlineUsers: (state, action) => {
      state.onlineUserIds = action.payload
    }
  }
})

export const { updateOnlineUsers } = onlineUsersSlice.actions

export const selectOnlineUserIds = (state) => {
  return state.onlineUsers.onlineUserIds
}

export const onlineUsersReducer = onlineUsersSlice.reducer
