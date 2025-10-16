import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'

const rootPersistConfig = {
  key: 'root',
  storage: storage, //biến storage ở trên lưu vào localStorage
  whitelist: ['user'] // định nghĩa các slice dữ liệu được phép duy trì trạng thái khi reload trang
  // blacklist: ['user'] // định nghĩa các slice dữ liệu không được phép duy trì trạng thái khi reload trang
}

// combineReducers: kết hợp nhiều reducer lại thành 1 reducer duy nhất
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer
})

const persistedReducer = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  // fix lỗi serializableCheck
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})