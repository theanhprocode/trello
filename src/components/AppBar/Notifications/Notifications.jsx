import { useState, useEffect } from 'react'
import moment from 'moment'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import DoneIcon from '@mui/icons-material/Done'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { socketIoInstance } from '~/socketClient'
import { addNotifications, clearCurrentNotifications, removeNotification } from '~/redux/notifications/notificationsSlice'
import { useNavigate } from 'react-router-dom'
import { fetchInvitationAPI, selectCurrentNotifications, updateBoardInvitationAPI } from '~/redux/notifications/notificationsSlice'
import { deleteInvitationAPI } from '~/apis/index'

const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}

function Notifications() {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClickNotificationIcon = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const [newNotification, setNewNotification] = useState(false)
  const [isClearingAll, setIsClearingAll] = useState(false)

  // lấy thông tin user hiện tại từ Redux
  const currentUser = useSelector(selectCurrentUser)

  const notifications = useSelector(selectCurrentNotifications)

  // fetch danh sách invitation
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchInvitationAPI())

    // func xử lý sự kiện real-time
    // https://socket.io/how-to/use-with-react
    const onReceiveNewInvitation = (invitation) => {
      if (invitation.inviteeId === currentUser._id) {
        // Cập nhật laị thông báo mới nhận được vào trong Redux
        dispatch(addNotifications(invitation))

        // Hiện thông báo có invitation mới
        setNewNotification(true)
      }
    }

    // lắng nghe sự kiện real-time từ server (BE_USER_INVITED_TO_BOARD)
    socketIoInstance.on('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)

    // cleanup function để hủy lắng nghe sự kiện khi component unmount
    return () => {
      socketIoInstance.off('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)
    }

  }, [dispatch, currentUser._id])

  const handleDeleteInvitation = async (invitationId) => {
    try {
      await deleteInvitationAPI(invitationId)
      dispatch(removeNotification(invitationId))
    } catch (error) {
      // Không log ra console trong production để tránh noise
    }
  }

  const handleClearAllNotifications = async () => {
    if (!notifications?.length) return

    setIsClearingAll(true)
    try {
      for (const notification of notifications) {
        await deleteInvitationAPI(notification._id)
      }
      dispatch(clearCurrentNotifications())
    } catch (error) {
      // Không log ra console trong production để tránh noise
    } finally {
      setIsClearingAll(false)
    }
  }

  // Cập nhật trạng thái của invitation
  const updateBoardInvitation = (status, invitationId) => {
    // console.log('status: ', status)
    // console.log('invitationId: ', invitationId)
    dispatch(updateBoardInvitationAPI({ status, invitationId }))
      .then(res => {
        if (res.payload.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED) {
          // Điều hướng người dùng đến trang board tương ứng nếu họ chấp nhận lời mời
          navigate(`/boards/${res.payload.boardInvitation.boardId}`)
        }
      })
  }

  return (
    <Box>
      <Tooltip title="Notifications">
        <Badge
          color="warning"
          // variant="none"
          variant= {newNotification ? 'dot' : 'none'}
          sx={{ cursor: 'pointer' }}
          id="basic-button-open-notification"
          aria-controls={open ? 'basic-notification-drop-down' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickNotificationIcon}
        >
          <NotificationsNoneIcon sx={{
            // color: 'white'
            color: newNotification ? 'yellow' : 'white'
          }} />
        </Badge>
      </Tooltip>

      <Menu
        sx={{ mt: 2 }}
        id="basic-notification-drop-down"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button-open-notification' }}
      >
        {notifications?.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, pt: 1 }}>
            <Button
              size="small"
              color="inherit"
              onClick={handleClearAllNotifications}
              disabled={isClearingAll}
            >
              {isClearingAll ? 'Clearing...' : 'Clear all'}
            </Button>
          </Box>
        )}
        {(!notifications || notifications.length === 0) && <MenuItem sx={{ minWidth: 200 }}>You do not have any new notifications.</MenuItem>}
        {notifications?.map((notification, index) =>
          <Box key={index}>
            <MenuItem sx={{
              minWidth: 200,
              maxWidth: 360,
              overflowY: 'auto'
            }}>
              <Box sx={{ maxWidth: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Nội dung của thông báo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box><GroupAddIcon fontSize="small" /></Box>
                  <Box><strong>{notification.inviter.displayName}</strong> had invited you to join the board <strong>{notification.board.title}</strong></Box>
                </Box>

                {notification.boardInvitation.status === BOARD_INVITATION_STATUS.PENDING &&
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      className="interceptor-loading"
                      type="submit"
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.ACCEPTED, notification._id)}
                    >
                      Accept
                    </Button>
                    <Button
                      className="interceptor-loading"
                      type="submit"
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.REJECTED, notification._id)}
                    >
                      Reject
                    </Button>
                  </Box>
                }
                {/* Khi Status của thông báo này là ACCEPTED hoặc REJECTED thì sẽ hiện thông tin đó lên */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                  {notification.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED &&
                  <Chip icon={<DoneIcon />} label="Accepted" color="success" size="small" />}
                  {notification.boardInvitation.status === BOARD_INVITATION_STATUS.REJECTED &&
                  <Chip icon={<NotInterestedIcon />} label="Rejected" size="small" />}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                  <Typography variant="span" sx={{ fontSize: '13px' }}>
                    {moment(notification.createdAt).format('llll')}
                  </Typography>
                  <Button
                    className="interceptor-loading"
                    type="submit"
                    variant="contained"
                    color="error"
                    size="small"
                    sx={{ minWidth: 'auto', p: 0.5, color: 'text.secondary' }}
                    onClick={() => handleDeleteInvitation(notification._id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </MenuItem>
            {index !== (notifications.length - 1) && <Divider />}
          </Box>
        )}
      </Menu>
    </Box>
  )
}

export default Notifications
