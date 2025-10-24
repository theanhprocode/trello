// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarProvider } from '@mui/material/styles'
import theme from '~/theme'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ConfirmProvider } from 'material-ui-confirm'

// react-router imports
import { BrowserRouter } from 'react-router-dom'

// Redux imports
import { Provider } from 'react-redux'
import { store } from '~/redux/store.js'

// redux-persist
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
const persistor = persistStore(store)

// inject redux store to authorizeAxios for dispatching logout action
import { injectStore } from '~/utilities/authorizeAxios'
injectStore(store)


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <CssVarProvider theme={theme}>
          <ConfirmProvider defaultOption={{ dialogProps: { maxWidth: 'xs' } }}>
            <CssBaseline/>
            <App />
            <ToastContainer position="bottom-left" theme="colored"/>
          </ConfirmProvider>
        </CssVarProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
)
