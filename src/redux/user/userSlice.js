import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utilities/authorizeAxios'
import { API_ROOT } from '~/utilities/constans'
import { toast } from 'react-toastify'


// Khởi tạo state của 1 slice
const initialState = {
  currentUser: null
}

// gọi api (bất đồng bộ) và cập nhật dữ liệu vào redux, dùng middleware createAsysncThunk kèm với extraReducers
// https://redux-toolkit.js.org/api/createAsyncThunk
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    return response.data
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
    if (showSuccessMessage) {
      toast.success('Logout successfully!')
    }
    return response.data
  }
)

// Tạo slice trong kho Redux store
export const userSlice = createSlice({
  name: 'user',
  initialState,
  // Nơi xử lý dữ liệu đồng bộ
  reducers: {},

  // extraReducers: nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      // action.payload là dữ liệu trả về từ API (response.data)
      const user = action.payload
      state.currentUser = user
    })

    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      /**
       * Khi logout thành công, xóa dữ liệu currentUser về null
       * kết hợp Protected đã làm ở App.jsx để chuyển hướng về trang login
       */
      state.currentUser = null
    })
  }
})

export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer