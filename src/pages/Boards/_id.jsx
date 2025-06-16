import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI } from '~/apis'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '683b400d55ac32933be5ee9b'

    fetchBoardDetailsAPI(boardId).then(board => {
      setBoard(board)
    })
  }, [])

  // goi apicolumn va lam moi du lieu
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })
    console.log('Created Column:', createdColumn)

    // cap nhat state board
  }

  // goi apicard va lam moi du lieu
  const createNewCard = async (newCardData) => {
    const createdColumn = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
    console.log('Created Column:', createdColumn)

    // cap nhat state board
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>

      <AppBar/>
      <BoardBar board={board}/>
      <BoardContent board={board} createNewColumn={createNewColumn} createNewCard={createNewCard} />

    </Container>
  )
}

export default Board
