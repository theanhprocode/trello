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

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/">
    <Provider store={store}>
      <CssVarProvider theme={theme}>
        <ConfirmProvider defaultOption={{ dialogProps: { maxWidth: 'xs' } }}>
          <CssBaseline/>
          <App />
          <ToastContainer position="bottom-left" theme="colored"/>
        </ConfirmProvider>
      </CssVarProvider>
    </Provider>
  </BrowserRouter>
)
