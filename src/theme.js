import { blue } from '@mui/material/colors'
// import { createTheme } from '@mui/material/styles'
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

const theme = extendTheme({
  cssVariables: true,
  customStyles: {
    heightSmall: '58px',
    heightLarge: '60px'
  },

  colorSchemes: {
    light: {
      palette: {
        mode: 'light',
        primary: {
          main: blue[500]
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