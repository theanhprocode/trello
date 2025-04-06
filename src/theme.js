import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

const theme = extendTheme({
  cssVariables: true,
  customStyles: {
    heightSmall: '58px',
    heightLarge: '60px'
  },

  typography: {
    allVariants: {
      lineHeight: 'normal'
    }
  },

  colorSchemes: {
    // light: {
    //   palette: {
    //     primary: teal,
    //     secondary: deepOrange
    //   }
    // },
    // dark: {
    //   palette: {
    //     primary: {
    //       main: blue[200]
    //     },
    //     secondary: orange
    //   }
    // }
  },
  components: {
    // Name of the component
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            with: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#dcdde1',
            borderRadius: '6px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#fff'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderWidth: '0.5px',
          '&:hover': { borderWidth: '0.5px' }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '& fieldset': { borderWidth: '0.5px !important' },
          '&:hover fieldset': { borderWidth: '1px !important' },
          '&:.Mui-focused fieldset': { borderWidth: '1px !important' }
        }
      }
    }
  }
})

export default theme