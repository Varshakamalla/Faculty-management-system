import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  newNotification: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications = [action.payload, ...state.notifications];
      state.newNotification = true;
    },
    resetNewNotification: (state) => {
      state.newNotification = false;
    },
  },
});

export const { setNotifications, addNotification, resetNewNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;
