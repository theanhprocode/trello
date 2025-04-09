
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { flexbox } from '@mui/system'

function BoardContent() {


  return (
    <Box sx={{
      bgcolor: (theme) => (theme.palette.mode) === 'dark' ? '#34495e' : '#1676d2',
      width: '100%',
      height: (theme) => theme.customStyles.boardContentHeight,
      p: '10px 0',
      display: 'flex',
      overflowX: 'auto',
      overflowY: 'hidden',
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      <ListColumns />
    </Box>
  )
}

export default BoardContent
