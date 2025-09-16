import authorizedAxiosInstance from '~/utilities/authorizeAxios'
import { API_ROOT } from '~/utilities/constans'
import { toast } from 'react-toastify'
// import axios from 'axios'


// board
// export const fetchBoardDetailsAPI = async (boardId) => {
//   const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
//   return response.data
// }

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  return response.data
}

// column
export const createNewColumnAPI = async (newColumnData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)
  return response.data
}

// card
export const createNewCardAPI = async (newCardData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}

export const updateCardTitleAPI = async (cardId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/cards/${cardId}`, updateData)
  return response.data
}

export const deleteCardDetailsAPI = async (cardId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/cards/${cardId}`)
  return response.data
}

// user
export const registerUserApi = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
  toast.success('Register successfully! Please check your email to verify your account.', { theme: 'colored' })
  return response.data
}


export const verifyUserApi = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
  toast.success('Account verified successfully! You can now log in.', { theme: 'colored' })
  return response.data
}