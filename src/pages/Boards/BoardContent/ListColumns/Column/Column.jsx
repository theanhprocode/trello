import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ListCards from './ListCards/ListCards'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'


function Column({ column, createNewCard, deleteColumnDetails, deleteCardDetails, updateCardTitle, updateColumnTitle }) {

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })
  const dndkitColumnStyles = {
    // touchAction:'none',
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.6 : undefined
  }
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const orderedCards = column.cards

  const [openRenameColumn, setOpenRenameColumn] = useState(false)
  const toggleRenameColumn = () => setOpenRenameColumn(!openRenameColumn)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleNewCardForm = () => setOpenNewCardForm(!openNewCardForm)
  const [newCardTitle, setNewCardTitle] = useState('')

  const addNewCard = () => {
    if (!newCardTitle) {
      toast.error('Card cần có tên', { position: 'top-right' })
      return
    }

    if (newCardTitle.trim().length < 3) {
      toast.error('Card không thể có tên dưới 3 ký tự', { position: 'top-right' })
      return
    }

    if (newCardTitle.trim().length > 256) {
      toast.error('Card không thể có tên trên 256 ký tự', { position: 'top-right' })
      return
    }

    // Call API to add new Card
    const newCardData = {
      title: newCardTitle.trim(),
      columnId: column._id
    }

    createNewCard(newCardData)

    // Reset form
    toggleNewCardForm()
    setNewCardTitle('')
  }

  // Xử lý xoá 1 column và tất cả các card bên trong
  const confirmDeleteColumn = useConfirm()
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: 'Xoá column',
      // description: 'Bạn có chắc chắn muốn xoá column này? Tất cả các card bên trong column này cũng sẽ bị xoá theo.',
      confirmationText: 'Xoá',
      cancellationText: 'Huỷ',
      confirmationButtonProps: { color: 'error' },
      cancellationButtonProps: { color: 'primary' },
      confirmationKeyword: 'Xoá',
      description: 'Nhập "Xoá" để xác nhận xoá column này và tất cả các card bên trong.',
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
      deleteColumnDetails(column._id)
    }).catch(() => {
      () => {}
    })
  }

  // Xử lý rename column
  const startRename = () => {
    setNewColumnTitle(column?.title || '')
    toggleRenameColumn()
  }

  const saveRename = () => {
    if (!newColumnTitle) {
      toast.error('Column cần có tên')
      return
    }
    if (newColumnTitle.trim().length < 3) {
      toast.error('Column title không thể có tên dưới 3 ký tự')
      return
    }
    if (newColumnTitle.trim().length > 50) {
      toast.error('Column không thể có tên trên 50 ký tự')
      return
    }

    // Check if title actually changed
    if (newColumnTitle.trim() === column?.title) {
      // No change, just close form
      toggleRenameColumn()
      setNewColumnTitle('')
      return
    }

    // TODO: Call API to update card title
    updateColumnTitle(column._id, newColumnTitle.trim())

    // Reset form
    toggleRenameColumn()
    setNewColumnTitle('')
  }


  return (
    <div ref={setNodeRef} style={dndkitColumnStyles} {...attributes} >
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode) === 'dark' ? '#333643' : '#ebecf0',
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.customStyles.boardContentHeight} - ${theme.spacing(5)})`
        }}>
        <Box sx={{
          // height: (theme) => theme.customStyles.columnHeaderHeight,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '50px'
        }}>
          {!openRenameColumn ? (
            <Typography variant='h6' sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>{column?.title}</Typography>
          ) : (
            // Rename form - Giống như add column form
            <Box data-no-dnd="true" sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              mb: 1
            }}>
              <TextField
                label="Enter new column name..."
                type="text"
                size='small'
                variant='outlined'
                autoFocus
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
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
                  onClick={toggleRenameColumn}
                  fontSize='small'
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { color: (theme) => theme.palette.warning.light }
                  }}
                />
              </Box>
            </Box>
          )}
          <Box>
            <Tooltip title='More option'>
              <ExpandMoreIcon
                sx={{ color: 'text.primary', cursor: 'pointer' }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
            >
              <MenuItem onClick={toggleNewCardForm} sx={{
                '&:hover': {
                  color: 'success.light',
                  '& .add-card-icon': {
                    color: 'success.light'
                  }
                }
              }}>
                <ListItemIcon><AddIcon className='add-card-icon' fontSize="small" /></ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
              <MenuItem onClick={startRename} sx={{
                '&:hover': {
                  color: 'primary.main',
                  '& .delete-icon': {
                    color: 'primary.main'
                  }
                }
              }}>
                <ListItemIcon><DriveFileRenameOutlineIcon className="delete-icon" fontSize="small" /></ListItemIcon>
                <ListItemText>Rename this column</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleDeleteColumn} sx={{
                '&:hover': {
                  color: 'warning.dark',
                  '& .delete-icon': {
                    color: 'warning.dark'
                  }
                }
              }}>
                <ListItemIcon><DeleteIcon className="delete-icon" fontSize="small" /></ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        {/* {column list card} */}
        <ListCards cards={orderedCards} deleteCardDetails={deleteCardDetails} updateCardTitle={updateCardTitle} />


        {/* {column footer} */}
        <Box sx={{
          height: (theme) => theme.customStyles.columnFooterHeight,
          p: 2
        }}>
          {!openNewCardForm
            ? <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Button startIcon={<AddIcon />} onClick={toggleNewCardForm}>Add new card</Button>
              <Tooltip title='Drag to move'>
                <DragHandleIcon sx={{ cursor: 'pointer' }}/>
              </Tooltip>
            </Box>
            : <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <TextField
                label="Enter card name..."
                type="text"
                size='small'
                variant='outlined'
                autoFocus
                data-no-dnd="true"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': { color: (theme) => theme.palette.primary.main, backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#333643' : 'white' },
                  '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: 'white' }
                  },
                  '& .MuiInputBase-input': {
                    borderRadius: 1
                  }
                }}
              />
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                  onClick={addNewCard}
                  variant="contained" color="success" size='small'
                  data-no-dnd="true"
                  sx={{ height: '30px', boxShadow: 'none', border: '1px solid', borderColor: (theme) => theme.palette.success.main, '&:hover': { bgcolor: (theme) => theme.palette.success.main, boxShadow: '0px 0px 8px rgb(105, 103, 103)' } }}
                >Add</Button>

                <CloseIcon onClick={toggleNewCardForm} data-no-dnd="true" fontSize='small' sx={{ color: (theme) => theme.palette.warning.light, cursor: 'pointer' }} />
              </Box>
            </Box>
          }

        </Box>
      </Box>
    </div>
  )
}

export default Column
