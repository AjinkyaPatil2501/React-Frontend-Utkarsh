import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  authLoaded: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = {
        userId: action.payload.userId,
        userName: action.payload.userName,
        bankId: action.payload.bankId,
        branchId: action.payload.branchId,
        photo: action.payload.photo
      };
      state.authLoaded = true;  // Mark auth check complete
    },
    logout: (state) => {
      state.user = null;
      state.authLoaded = true;  // Mark auth check complete after logout
    },
    authChecked: (state) => {        
      state.authLoaded = true;  // Used for session restore when no user
    }
  }
});

export const { loginSuccess, logout, authChecked } = authSlice.actions;
export default authSlice.reducer;
