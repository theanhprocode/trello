// export const API_ROOT = 'http://localhost:8017'
let apiRoot = ''

// console.log('process.env', process.env)

if (import.meta.env.DEV) {
  apiRoot = 'http://localhost:8017'
}

if (import.meta.env.PROD) {
  apiRoot = '/api' // ← Qua _redirects sẽ proxy đến Render
}
console.log('🚀 ~ apiRoot:', apiRoot)
export const API_ROOT = apiRoot

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEM_PER_PAGE = 12
