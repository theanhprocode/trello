import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utilities/authorizeAxios'
import { API_ROOT } from '~/utilities/constans'
import { mapOrder } from '~/utilities/sorts'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utilities/formatters'


// Khởi tạo state của 1 slice
const initialState = {
  currentActiveBoard: null
}

// gọi api (bất đồng bộ) và cập nhật dữ liệu vào redux, dùng middleware createAsysncThunk kèm với extraReducers
// https://redux-toolkit.js.org/api/createAsyncThunk
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    return response.data
  }
)

// Tạo slice trong kho Redux store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Nơi xử lý dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, đang gán ra biến có nghĩa hơn
      const board = action.payload

      // Xử lý dữ liệu nếu cần thiết
      // ...

      // update lại dữ liệu của cái CurrentActiveBoard
      state.currentActiveBoard = board
    },
    updateCardInBoard: (state, action) => {
      // update nested data
      // https://redux-toolkit.js.org/usage/immer-reducers#updating-nested-data
      const incomingCard = action.payload

      // tìm từ board > columns > cards
      const column = state.currentActiveBoard.columns.find(col => col._id === incomingCard.columnId)
      if (column) {
        const card = column.cards.find(card => card._id === incomingCard._id)
        if (card) {
          Object.keys(incomingCard).forEach(key => {
            card[key] = incomingCard[key]
          })
        }
      }
    }
  },

  // extraReducers: nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // action.payload là dữ liệu trả về từ API (response.data)
      let board = action.payload

      // sắp lại column trước khi đưa dữ liệu xuống dưới
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      // xử lý kéo thả vào 1 column rỗng
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // sắp xếp lại cards trước khi đưa xuống dưới
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      // update lại dữ liệu của cái CurrentActiveBoard
      state.currentActiveBoard = board
    })
  }
})

//active: là nơi danh cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
export const { updateCurrentActiveBoard, updateCardInBoard } = activeBoardSlice.actions

// selectors: là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu trong kho Redux store
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// Export reducer để kết hợp vào store
// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer