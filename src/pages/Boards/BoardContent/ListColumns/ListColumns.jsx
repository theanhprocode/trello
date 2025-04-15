import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'

function ListColumns({ columns }) {

  return (
    <div>
      <SortableContext items={columns?.map( c => c._id)} strategy={horizontalListSortingStrategy}>
        <Box sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex'
        }}>

          {columns?.map(column => <Column key={column._id} column={column} /> )}

          <Box sx={{
            minWidth: '200px',
            maxWidth: '200px',
            mx: 2,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d'
          }}>
            <Button sx={{ color: 'white', width: '100%', justifyContent: 'flex-start', pl: 2.5, py: 1 }} startIcon={<AddToPhotosIcon />} >Add new column</Button>
          </Box>

        </Box>
      </SortableContext>
    </div>
  )
}

export default ListColumns
