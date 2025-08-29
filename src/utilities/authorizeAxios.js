/* eslint-disable indent */
import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utilities/formatters'


// Khởi tạo một đối tượng đẻ custom và cấu hình chung
let authorizedAxiosInstance = axios.create()
// Thời gian chờ tối đa của 1 request
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials: true để gửi cookie
authorizedAxiosInstance.defaults.withCredentials = true

// Cấu hình Interceptor cho request
// https://axios-http.com/docs/interceptors

// Add a request interceptor: can thiệp vào request trước khi gửi đi
authorizedAxiosInstance.interceptors.request.use((config) => {
    // Chăn spam click
    interceptorLoadingElements(true)
    return config
  }, (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor: can thiệp vào response trước khi nhận kết quả
authorizedAxiosInstance.interceptors.response.use((response) => {
    // Chăn spam click
    interceptorLoadingElements(false)
    return response
  }, (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // Chăn spam click
    interceptorLoadingElements(false)
    // Mọi status ngoài 2xx đều sẽ vào đây
    let errorMessage = error?.message
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message
    }
    // Hiển thị mọi mã lỗi trừ 410
    if (error?.response?.statusCode !== 410) {
      toast.error(errorMessage)
    }
    return Promise.reject(error)
  })


export default authorizedAxiosInstance