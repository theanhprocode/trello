import Button from '@mui/material/Button'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import ThreeDRotation from '@mui/icons-material/ThreeDRotation'
import Typography from '@mui/material/Typography'
import { useColorScheme } from '@mui/material/styles'

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
