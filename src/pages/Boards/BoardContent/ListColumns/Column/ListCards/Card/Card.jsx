import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'
import { useConfirm } from 'material-ui-confirm'
import CachedIcon from '@mui/icons-material/Cached'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'

function Card({ card, deleteCardDetails, updateCardTitle }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  })
  const dndkitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid rgb(46, 204, 51)' : undefined
  }

  const shouldShowCardActions = () => {
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length
  }

  // Menu dropdown cho card actions
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  // RENAME CARD TOGGLE - Giống như openNewColumnForm
  const [openRenameForm, setOpenRenameForm] = useState(false)
  const toggleRenameForm = () => setOpenRenameForm(!openRenameForm)
  const [newCardTitle, setNewCardTitle] = useState('')

  const handleClick = (event) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // Start rename - Giống như addNewColumn logic
  const startRename = () => {
    setNewCardTitle(card?.title || '')
    toggleRenameForm()
    handleClose()
  }

  // Save rename - Giống như addNewColumn
  const saveRename = () => {
    if (!newCardTitle) {
      toast.error('Card cần có tên')
      return
    }
    if (newCardTitle.trim().length < 3) {
      toast.error('Card title không thể có tên dưới 3 ký tự')
      return
    }
    if (newCardTitle.trim().length > 50) {
      toast.error('Card không thể có tên trên 50 ký tự')
      return
    }

    // Check if title actually changed
    if (newCardTitle.trim() === card?.title) {
      // No change, just close form
      toggleRenameForm()
      setNewCardTitle('')
      return
    }

    // TODO: Call API to update card title
    updateCardTitle(card._id, newCardTitle.trim())
    // updateCardTitle(card._id, newCardTitle.trim())

    // Reset form - Giống như addNewColumn
    toggleRenameForm()
    setNewCardTitle('')
  }

  const confirmDeleteCard = useConfirm()
  const handleDeleteCard = () => {
    confirmDeleteCard({
      title: 'Xoá card',
      confirmationText: 'Xoá',
      cancellationText: 'Huỷ',
      confirmationButtonProps: { color: 'error' },
      cancellationButtonProps: { color: 'primary' },
      description: 'Bạn có chắc muốn xoá card này không?',
      dialogProps: {
        PaperProps: {
          sx: {
            '& .MuiDialogContentText-root': {
              mb: '8px'
            }
          }
        }
      }
    }).then(() => {
      deleteCardDetails(card._id)
    }).catch(() => {
      () => {}
    })
  }

  return (
    <MuiCard
      ref={setNodeRef} style={dndkitCardStyles} {...attributes} {...listeners}
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        overflow: 'unset',
        opacity: card.FE_PlaceholderCard ? '0' : '1',
        minWidth: card.FE_PlaceholderCard ? '280px' : 'unset',
        pointerEvents: card.FE_PlaceholderCard ? 'none' : 'unset',
        position: card.FE_PlaceholderCard ? 'fixed' : 'unset',
        border: '1px solid transparent',
        '&:hover': { borderColor: (theme) => theme.palette.primary.main }
      }}
    >
      {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} />}
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>

        {/* ✅ CONDITIONAL RENDERING - Giống như openNewColumnForm */}
        {!openRenameForm ? (
          // Normal card title display
          <Typography sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {card?.title}
            <MoreVertIcon
              onClick={handleClick}
              sx={{
                cursor: 'pointer',
                '&:hover': { color: 'primary.main' }
              }}
            />
          </Typography>
        ) : (
          // Rename form - Giống như add column form
          <Box data-no-dnd="true" sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            mb: 1
          }}>
            <TextField
              label="Enter new card name..."
              type="text"
              size='small'
              variant='outlined'
              autoFocus
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveRename()}
            />
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                onClick={saveRename}
                variant="contained" color="success" size='small'
                sx={{
                  height: '30px',
                  boxShadow: 'none',
                  border: '1px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.success.main,
                    boxShadow: '0px 0px 8px rgb(105, 103, 103)'
                  }
                }}
              >
                Save
              </Button>
              <CloseIcon
                onClick={toggleRenameForm}
                fontSize='small'
                sx={{
                  cursor: 'pointer',
                  '&:hover': { color: (theme) => theme.palette.warning.light }
                }}
              />
            </Box>
          </Box>
        )}

        {/* Menu dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          data-no-dnd="true"
          onClose={handleClose}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={handleDeleteCard} sx={{
            '&:hover': {
              color: 'error.main',
              '& .delete-icon': {
                color: 'error.main'
              }
            }
          }}>
            <ListItemIcon>
              <DeleteIcon className="delete-icon" fontSize="small" />
            </ListItemIcon>
            <ListItemText>Xoá card</ListItemText>
          </MenuItem>

          <MenuItem onClick={startRename} sx={{
            '&:hover': {
              color: 'success.main',
              '& .rename-icon': {
                color: 'success.main'
              }
            }
          }}>
            <ListItemIcon>
              <CachedIcon className="rename-icon" fontSize="small" />
            </ListItemIcon>
            <ListItemText>Đổi tên card</ListItemText>
          </MenuItem>
        </Menu>
      </CardContent>

      {shouldShowCardActions() &&
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {!!card?.memberIds?.length && <Button size="small" startIcon={<GroupIcon/>}>{card?.memberIds?.length}</Button>}
          {!!card?.comments?.length && <Button size="small" startIcon={<CommentIcon/>}>{card?.comments?.length}</Button>}
          {!!card?.attachments?.length && <Button size="small" startIcon={<AttachFileIcon/>}>{card?.attachments?.length}</Button>}
        </CardActions>
      }
    </MuiCard>
  )
}

export default Card