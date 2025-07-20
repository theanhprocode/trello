import { useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import TextField from '@mui/material/TextField'
// import InputAdornment from '@mui/material/InputAdornment'
// import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'


function ListColumns({ columns, createNewColumn, createNewCard, deleteColumnDetails, deleteCardDetails, updateCardTitle, updateColumnTitle }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle, setNewColumnTitle] = useState('')

  const addNewColumn = () => {
    if (!newColumnTitle) {
      toast.error('Column cần có tên', { position: 'top-right' })
      return
    }
    if (newColumnTitle.trim().length < 3) {
      toast.error('Column title không thể có tên dưới 3 ký tự', { position: 'top-right' })
      return
    }
    if (newColumnTitle.trim().length > 50) {
      toast.error('Column không thể có tên trên 50 ký tự', { position: 'top-right' })
      return
    }

    // Call API to add new column
    const newColumnData = {
      title: newColumnTitle.trim()
    }

    createNewColumn(newColumnData)

    // Reset form
    toggleNewColumnForm()
    setNewColumnTitle('')
  }

  // const [searchValue, setSearchValue] = useState('')


  return (
    <div>
      <SortableContext items={columns?.map( c => c._id)} strategy={horizontalListSortingStrategy}>
        <Box sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex'
        }}>

          {columns?.map(column => <Column key={column._id} column={column} createNewCard={createNewCard} deleteColumnDetails={deleteColumnDetails} deleteCardDetails={deleteCardDetails} updateCardTitle={updateCardTitle} updateColumnTitle={updateColumnTitle} /> )}

          {!openNewColumnForm
            ? <Box onClick={toggleNewColumnForm} sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d'
            }}>
              <Button sx={{ color: 'white', width: '100%', justifyContent: 'flex-start', pl: 2.5, py: 1 }} startIcon={<AddToPhotosIcon />} >Add new column</Button>
            </Box>
            : <Box sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              p: 1,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              <TextField
                label="Enter column name..."
                type="text"
                size='small'
                variant='outlined'
                autoFocus
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                sx={{
                  '& label': { color: 'white' },
                  '& input': { color: 'white' },
                  '& label.Mui-focused': { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'white' },
                    '&:hover fieldset': { borderColor: 'white' },
                    '&.Mui-focused fieldset': { borderColor: 'white' }
                  }
                }}
              />
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                  onClick={addNewColumn}
                  variant="contained" color="success" size='small'
                  sx={{ height: '30px', boxShadow: 'none', border: '1px solid', borderColor: (theme) => theme.palette.success.main, '&:hover': { bgcolor: (theme) => theme.palette.success.main, boxShadow: '0px 0px 8px rgb(105, 103, 103)' } }}
                >Add column</Button>

                <CloseIcon onClick={toggleNewColumnForm} fontSize='small' sx={{ color: 'white', cursor: 'pointer', '&:hover': { color: (theme) => theme.palette.warning.light } }} />
              </Box>
            </Box>
          }
        </Box>
      </SortableContext>
    </div>
  )
}

export default ListColumns
