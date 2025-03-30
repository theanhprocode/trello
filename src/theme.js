import { createTheme } from '@mui/material/styles'
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

const theme = extendTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        mode: 'light',
        primary: {
          main: '#fff'
        }
      }
    },
    dark: {
      palette: {
        mode: 'dark',
        primary: {
          main: '#333'
        }
      }
    }
  }
})

export default theme