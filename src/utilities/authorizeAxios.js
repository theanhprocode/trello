/* eslint-disable indent */
import axios from 'axios'
import { toast } from 'react-toastify'


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
    // Do something before request is sent
    return config
  }, (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor: can thiệp vào response trước khi nhận kết quả
authorizedAxiosInstance.interceptors.response.use((response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log('✅ Axios success response:', response.status, response.config.url)
    return response
  }, (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // Mọi status ngoài 2xx đều sẽ vào đây
    console.log('Axios response error:', error)
    let errorMessage = error?.message
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message
    }
    // hiển thị mọi mã lỗi trừ 410
    if (error?.response?.statusCode !== 410) {
      toast.error(errorMessage)
    }
    return Promise.reject(error)
  })


export default authorizedAxiosInstance