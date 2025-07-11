// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarProvider } from '@mui/material/styles'
import theme from '~/theme'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ConfirmProvider } from 'material-ui-confirm'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <CssVarProvider theme={theme}>
    <ConfirmProvider defaultOption={{ dialogProps: { maxWidth: 'xs' } }}>
      <CssBaseline/>
      <App />
      <ToastContainer position="bottom-left" theme="colored"/>
    </ConfirmProvider>
  </CssVarProvider>
  // </React.StrictMode>
)
