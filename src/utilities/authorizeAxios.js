/* eslint-disable indent */
import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utilities/formatters'
import { refreshTokenApi } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'


let axiosReduxStore
export const injectStore = mainStore => { axiosReduxStore = mainStore }


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

// Khởi tạo promise cho việc gọi api làm mới token
// https://www.thedutchlab.com/inzichten/using-axios-interceptors-for-refreshing-your-api-token
let refreshTokenPromise = null


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

    // TH1: nếu lỗi 401 (Unauthorized) -> gọi api logout
    if (error.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUserAPI(false))
    }

    // TH2: nếu lỗi 410 (Token expired) -> gọi api refreshToken làm mới accessToken
    const originalRequests = error.config
    // console.log('originalRequests', originalRequests)
    if (error?.response?.status === 410 && !originalRequests._retry) {
      // gán retry = true trong khoảng thời gian chờ, đảm bảo việc refresh token này chỉ luôn gọi 1 lần tại 1 thời điểm
      originalRequests._retry = true

      // các requests tiếp theo nếu có lỗi 410 sẽ dùng lại promise này
      // nếu chưa có promise refreshToken nào đang chạy thì tạo mới
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenApi()
          .then((data) => {
            // Refresh token thành công
            return data?.accessToken
          })
          .catch(() => {
            // Refresh token thất bại → logout user
            axiosReduxStore.dispatch(logoutUserAPI(false))
          })
          .finally(() => {
            // Reset promise sau khi hoàn thành
            refreshTokenPromise = null
          })
      }
      // eslint-disable-next-line no-unused-vars
      return refreshTokenPromise.then(accessToken => {
        // 1 lần nữa gán lại accessToken mới vào header Authorization
        return authorizedAxiosInstance(originalRequests)
      })
    }

    // Mọi status ngoài 2xx đều sẽ vào đây
    let errorMessage = error?.message
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message
    }
    // Hiển thị mọi mã lỗi trừ 410
    if (error.response?.status !== 410) {
      toast.error(errorMessage)
    }
    return Promise.reject(error)
  })


export default authorizedAxiosInstance