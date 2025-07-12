
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


function Card({ card, deleteCardDetails }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  })
  const dndkitCardStyles = {
    // touchAction:'none',
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

  const handleClick = (event) => {
    event.stopPropagation() // Ngăn không cho trigger drag
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
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
        // display: card?.FE_PlaceholderCard ? 'none' : 'block'
        opacity: card.FE_PlaceholderCard ? '0' : '1',
        minWidth: card.FE_PlaceholderCard ? '280px' : 'unset',
        pointerEvents: card.FE_PlaceholderCard ? 'none' : 'unset',
        position: card.FE_PlaceholderCard ? 'fixed' : 'unset',
        border: '1px solid transparent',
        '&:hover': { borderColor: (theme) => theme.palette.primary.main }
      }}
    >
      {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} /> }
      <CardContent sx={{ p: 1.5, '&:last-child': { p:1.5 } }}>
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

        {/* Menu dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={open}
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
        </Menu>
      </CardContent>
      {shouldShowCardActions() &&
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {!!card?.memberIds?.length && <Button size="small" startIcon={<GroupIcon/>}>{card?.memberIds?.length}</Button> }
          {!!card?.comments?.length && <Button size="small" startIcon={<CommentIcon/>}>{card?.comments?.length}</Button> }
          {!!card?.attachments?.length && <Button size="small" startIcon={<AttachFileIcon/>}>{card?.attachments?.length}</Button> }
        </CardActions>
      }


    </MuiCard>
  )
}

export default Card
