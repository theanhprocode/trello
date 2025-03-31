import Button from '@mui/material/Button'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import ThreeDRotation from '@mui/icons-material/ThreeDRotation'
import Typography from '@mui/material/Typography'
import { useColorScheme } from '@mui/material/styles'
// import { useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest'

function ModeSelect() {
  const { mode, setMode } = useColorScheme()
  const handleChange = (event) => {
    const selectedMode = event.target.value
    setMode(selectedMode)
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="label-select-dark-light-mode">Mode</InputLabel>
        <Select
          labelId="label-select-dark-light-mode"
          id="dark-light-mode"
          value={mode}
          label="Mode"
          onChange={handleChange}
        >
          <MenuItem value='light'>
            <Box sx={{ display: 'flex', alighItems: 'center', gap: 1 }}>
              <LightModeIcon fontSize='small'/>Light
            </Box>
          </MenuItem>
          <MenuItem value='dark'>
            <Box sx={{ display: 'flex', alighItems: 'center', gap: 1 }}>
              <DarkModeIcon fontSize='small'/>Dark
            </Box>
          </MenuItem>
          <MenuItem value='system'>
            <Box sx={{ display: 'flex', alighItems: 'center', gap: 1 }}>
              <SettingsSuggestIcon fontSize='small'/>System
            </Box>
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

function ToggleColorMode() {

  const { mode, setMode } = useColorScheme()

  const toggleColorMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light')
  }

  return (
    <Button onClick={toggleColorMode}>
      Chuyển sang chế độ {mode === 'light' ? 'tối' : 'sáng'}
    </Button>
  )
}

function App() {

  return (
    <>
      <ModeSelect/>
      <ToggleColorMode/>
      <div>theanh</div>

      <Typography variant='h4' color='text.secondary'>theanh1</Typography>
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <AccessAlarmIcon/>
      <ThreeDRotation/>
    </>
  )
}

export default App
