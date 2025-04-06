import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest'
import Box from '@mui/material/Box'
import { useColorScheme } from '@mui/material/styles'


function ModeSelect() {
  const { mode, setMode } = useColorScheme()
  const handleChange = (event) => {
    const selectedMode = event.target.value
    setMode(selectedMode)
  }

  return (
    <Box>
      <FormControl size="small" sx={{ minWidth: '120px' }} >
        <InputLabel sx={{ color: 'white', '&.Mui-focused': { color: 'white' } }} id="label-select-dark-light-mode">Mode</InputLabel>
        <Select
          labelId="label-select-dark-light-mode"
          id="dark-light-mode"
          value={mode}
          label="Mode"
          onChange={handleChange}
          sx={{
            color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
            '.MuiSvgIcon-root': { color: 'white' }
          }}
        >
          <MenuItem value='light'>
            <Box sx={{ display: 'flex', alighItems: 'center', gap: 1 }}>
              <LightModeIcon fontSize='small' />Light
            </Box>
          </MenuItem>
          <MenuItem value='dark'>
            <Box sx={{ display: 'flex', alighItems: 'center', gap: 1 }}>
              <DarkModeIcon fontSize='small' />Dark
            </Box>
          </MenuItem>
          <MenuItem value='system'>
            <Box sx={{ display: 'flex', alighItems: 'center', gap: 1 }}>
              <SettingsSuggestIcon fontSize='small' />System
            </Box>
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

export default ModeSelect