import Box from '@mui/material/Box'
import Card from './Card/Card'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'


function ListCards({ cards, deleteCardDetails, updateCardTitle }) {
  return (
    <SortableContext items={cards?.map( c => c._id)} strategy={verticalListSortingStrategy}>
      <Box sx={{
        display: 'flex',
        p: '0 5px 5px 5px',
        m: '0 5px',
        flexDirection: 'column',
        gap: 1,
        overflowX: 'hidden',
        overflowY: 'auto',
        maxHeight: (theme) => `calc(
          ${theme.customStyles.boardContentHeight} -
          ${theme.spacing(5)} -
          ${theme.customStyles.columnHeaderHeight} -
          ${theme.customStyles.columnFooterHeight}
        )`,
        '&::-webkit-scrollbar-thumb': { backgroundColor: '#ced0da' },
        '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#bfc2cf' }
      }} >
        {cards?.map(card => <Card key={card._id} card={card} deleteCardDetails={deleteCardDetails} updateCardTitle={updateCardTitle} /> )}
      </Box>
    </SortableContext>
  )
}

export default ListCards
