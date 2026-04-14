import { useState } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import AddIcon from '@mui/icons-material/Add'
import Badge from '@mui/material/Badge'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

function CardUserGroup({ cardMemberIds = [], board, onUpdateCardMembers }) {
  const boardUsers = board?.FE_allUsers || []
  const cardMembers = boardUsers.filter(user => cardMemberIds.includes(user._id))

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

  return (
    <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {/* Nếu dưới 5 user: hiển thị toàn bộ boardUsers. Từ 5 trở lên: chỉ hiển thị cardMembers */}
      {(boardUsers.length < 5 ? boardUsers : cardMembers).map(user =>
        <Tooltip title={user?.displayName} key={user._id}>
          <Avatar
            sx={{ width: 34, height: 34, cursor: 'pointer' }}
            alt={user?.displayName}
            src={user?.avatar}
          />
        </Tooltip>
      )}

      {/* Nút này để mở popover thêm member - chỉ hiện khi có từ 5 user trở lên */}
      {boardUsers.length >= 5 &&
        <Tooltip title="Add new member">
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
            <AddIcon fontSize="small" />
          </Box>
        </Tooltip>
      }

      {/* Khi Click vào + ở trên thì sẽ mở popover hiện toàn bộ users trong board để người dùng Click chọn thêm vào card  */}
      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, maxWidth: '260px', display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {boardUsers.map(user =>
            <Tooltip title={user?.displayName} key={user._id}>
              <Badge
                sx={{ cursor: 'pointer' }}
                overlap="rectangular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  cardMemberIds.includes(user._id)
                    ? <CheckCircleIcon fontSize="small" sx={{ color: '#27ae60' }} />
                    : null
                }
              >
                <Avatar
                  sx={{ width: 34, height: 34 }}
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
