import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI, updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardToDifferentColumnAPI, deleteColumnDetailsAPI, deleteCardDetailsAPI, updateCardTitleAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utilities/formatters'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utilities/sorts'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'


function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '683b400d55ac32933be5ee9b'

    fetchBoardDetailsAPI(boardId).then(board => {
      // sắp lại column trước khi đưa dữ liệu xuống dưới
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      // xử lý kéo thả vào 1 column rỗng
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // sắp xếp lại cards trước khi đưa xuống dưới
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      setBoard(board)
    })
  }, [])

  // goi apicolumn va lam moi du lieu
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })
    // console.log('Created Column:', createdColumn)

    // khi tạo mới column, sẽ tạo luôn 1 card placeholder
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // cap nhat state board
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  // goi apicard va lam moi du lieu
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
    // console.log('Created Card:', createdCard)

    // cap nhat state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      // xoá card placeholder khi thêm card mới
      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        // nếu không có card placeholder thì thêm card mới vào cuối
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    setBoard(newBoard)
  }

  // gọi api và xử lý khi kéo thả column xong
  const moveColumns = (dndOrderedColumns) => {
    // cập nhật lại dữ liệu state board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // gọi api cập nhật lại thứ tự column
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)

    // gọi api cập nhật column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns ) => {
    // console.log('moveCardToDifferentColumn', currentCardId, prevColumnId, nextColumnId, dndOrderedColumns)

    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // gọi api
    // xử lý trường hợp kéo card cuối cùng trong column
    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })

  }

  if (!board) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 1 }}>
        <CircularProgress size="30px" />
        <Typography> loading... </Typography>
      </Box>
    )
  }

  const deleteColumnDetails = (columnId) => {
    // update state board
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter(column => column._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== columnId)
    setBoard(newBoard)

    // gọi API xoá column
    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success(res?.deleteResult)
    })
  }

  const deleteCardDetails = (cardId) => {
    // update state board
    const newBoard = { ...board }

    // Tìm column chứa card cần xóa
    const columnToUpdate = newBoard.columns.find(column =>
      column.cards.some(card => card._id === cardId)
    )

    if (columnToUpdate) {
      // xóa card khỏi mảng cards
      columnToUpdate.cards = columnToUpdate.cards.filter(card => card._id !== cardId)
      // xóa cardId khỏi cardOrderIds
      columnToUpdate.cardOrderIds = columnToUpdate.cardOrderIds.filter(_id => _id !== cardId)

      // xử lý column rỗng - thêm placeholder card
      if (isEmpty(columnToUpdate.cards)) {
        columnToUpdate.cards = [generatePlaceholderCard(columnToUpdate)]
        columnToUpdate.cardOrderIds = [generatePlaceholderCard(columnToUpdate)._id]
      }
    }
    setBoard(newBoard)

    // gọi API xoá card
    deleteCardDetailsAPI(cardId).then(res => {
      toast.success(res?.deleteResult)
    })
  }

  const updateCardTitle = async (cardId, newTitle) => {
    // Backup original state for rollback
    const originalBoard = { ...board }

    try {
      // update state board (optimistic update)
      const newBoard = { ...board }
      const columnToUpdate = newBoard.columns.find(column =>
        column.cards.some(card => card._id === cardId)
      )

      if (columnToUpdate) {
        const cardToUpdate = columnToUpdate.cards.find(card => card._id === cardId)
        if (cardToUpdate) {
          cardToUpdate.title = newTitle
        }
      }
      setBoard(newBoard)

      // gọi API cập nhật title
      await updateCardTitleAPI(cardId, { title: newTitle })
      toast.success('Card title updated successfully!')

    } catch (error) {
      // Rollback state on error
      setBoard(originalBoard)
      toast.error('Failed to update card title')
      // console.error('Error updating card title:', error)
    }
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>

      <AppBar/>
      <BoardBar board={board}/>
      <BoardContent
        board={board}

        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
        deleteCardDetails={deleteCardDetails}
        updateCardTitle={updateCardTitle}
      />

    </Container>
  )
}

export default Board
