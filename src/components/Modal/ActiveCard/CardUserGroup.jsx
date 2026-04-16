import { useState } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import AddIcon from '@mui/icons-material/Add'
import Badge from '@mui/material/Badge'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useSelector } from 'react-redux'
import { selectOnlineUserIds } from '~/redux/onlineUsers/onlineUsersSlice'

function CardUserGroup({ cardMemberIds = [], board, onUpdateCardMembers }) {
  const boardUsers = board?.FE_allUsers || []
  const cardMembers = boardUsers.filter(user => cardMemberIds.includes(user._id))
  const onlineUserIds = useSelector(selectOnlineUserIds)

  /**
   * Xử lý Popover để ẩn hoặc hiện toàn bộ user trên một cái popup
   * https://mui.com/material-ui/react-popover/
   */
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'card-all-users-popover' : undefined
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  const LIMIT = 5

  return (
    <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {/* Hiển thị tối đa 5 user */}
      {boardUsers.slice(0, LIMIT).map(user =>
        <Tooltip title={user?.displayName} key={user._id}>
          <Badge
            overlap="circular"
            variant="dot"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: onlineUserIds.includes(user._id) ? '#44b700' : '#bdbdbd',
                width: 10, height: 10, borderRadius: '50%',
                border: '2px solid white'
              }
            }}
          >
            <Avatar
              sx={{ width: 34, height: 34, cursor: 'pointer' }}
              alt={user?.displayName}
              src={user?.avatar}
            />
          </Badge>
        </Tooltip>
      )}

      {/* Nếu quá 5 user thì hiện +number */}
      {boardUsers.length > LIMIT &&
        <Tooltip title="Show more">
          <Box
            aria-describedby={popoverId}
            onClick={handleTogglePopover}
            sx={{
              width: 36,
              height: 36,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '50%',
              color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2f3542' : theme.palette.grey[200],
              '&:hover': {
                color: (theme) => theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
                bgcolor: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
              }
            }}
          >
            +{boardUsers.length - LIMIT}
          </Box>
        </Tooltip>
      }

      {/* Popover hiện những user còn lại (từ vị trí LIMIT trở đi) */}
      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, maxWidth: '260px', display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {boardUsers.slice(LIMIT).map(user =>
            <Tooltip title={user?.displayName} key={user._id}>
              <Badge
                overlap="circular"
                variant="dot"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: onlineUserIds.includes(user._id) ? '#44b700' : '#bdbdbd',
                    width: 10, height: 10, borderRadius: '50%',
                    border: '2px solid white'
                  }
                }}
              >
                <Avatar
                  sx={{ width: 34, height: 34, cursor: 'pointer' }}
                  alt={user?.displayName}
                  src={user?.avatar}
                />
              </Badge>
            </Tooltip>
          )}
        </Box>
      </Popover>
    </Box>
  )
}

export default CardUserGroup
