// export const API_ROOT = 'http://localhost:8017'
let apiRoot = ''
let socketUrl = ''

// console.log('process.env', process.env)

if (import.meta.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
  socketUrl = 'http://localhost:8017'
}

if (import.meta.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-api-wd33.onrender.com'
  socketUrl = 'https://trello-api-wd33.onrender.com'
}
console.log('🚀 ~ apiRoot:', apiRoot)
export const API_ROOT = apiRoot
export const SOCKET_URL = socketUrl

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEM_PER_PAGE = 12
