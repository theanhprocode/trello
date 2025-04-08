import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { bgcolor } from '@mui/system'


const MENU_STYLE = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar() {
  return (
    <Box px={2} sx={{
      width: '100%',
      height: (theme) => theme.customStyles.heightLarge,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      justifyContent: 'space-between',
      overflowX: 'auto',
      borderBottom: '1px solid #fff',
      bgcolor: (theme) => (theme.palette.mode) === 'dark' ? '#34495e' : '#1676d2'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLE}
          icon={<SpaceDashboardIcon />}
          label="Theanh"
          clickable
        />

        <Chip
          sx={MENU_STYLE}
          icon={<VpnLockIcon />}
          label="Public/Private Workspace"
          clickable
        />

        <Chip
          sx={MENU_STYLE}
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          clickable
        />

        <Chip
          sx={MENU_STYLE}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />

        <Chip
          sx={MENU_STYLE}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon fontSize='small' />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >Invite</Button>

        <AvatarGroup max={3} sx={{ gap: '10px', '& .MuiAvatar-root': { width: '34px', height: '34px', fontSize: '16px', border: 'none', color: 'white', cursor: 'pointer', '&:first-of-type': { bgcolor: '#a4b0be' } } }}>
          <Tooltip title="theanh">
            <Avatar alt="Theanh" src="https://lh3.googleusercontent.com/ogw/AF2bZyjDCEHr4iqlRuN6gY4Jr_E19PWBAHCQjbdDwt8MYajhzNE=s32-c-mo" />
          </Tooltip>

          <Tooltip title="theanh">
            <Avatar alt="Theanh" src="https://lh3.googleusercontent.com/ogw/AF2bZyjDCEHr4iqlRuN6gY4Jr_E19PWBAHCQjbdDwt8MYajhzNE=s32-c-mo" />
          </Tooltip>

          <Tooltip title="theanh">
            <Avatar alt="Theanh" src="https://lh3.googleusercontent.com/ogw/AF2bZyjDCEHr4iqlRuN6gY4Jr_E19PWBAHCQjbdDwt8MYajhzNE=s32-c-mo" />
          </Tooltip>

          <Tooltip title="theanh">
            <Avatar alt="Theanh" src="https://lh3.googleusercontent.com/ogw/AF2bZyjDCEHr4iqlRuN6gY4Jr_E19PWBAHCQjbdDwt8MYajhzNE=s32-c-mo" />
          </Tooltip>

          <Tooltip title="theanh">
            <Avatar alt="Theanh" src="https://lh3.googleusercontent.com/ogw/AF2bZyjDCEHr4iqlRuN6gY4Jr_E19PWBAHCQjbdDwt8MYajhzNE=s32-c-mo" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
