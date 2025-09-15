import { useEffect } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardToDifferentColumnAPI } from '~/apis'
import { cloneDeep } from 'lodash'
import { fetchBoardDetailsAPI, updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'


function Board() {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  // const [board, setBoard] = useState(null)

  const { boardId } = useParams() // Lấy boardId từ URL nếu cần thiết

  useEffect(() => {
    // gọi api lấy dữ liệu board

    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])


  // gọi api và xử lý khi kéo thả column xong
  const moveColumns = (dndOrderedColumns) => {
    // cập nhật lại dữ liệu state board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // gọi api cập nhật lại thứ tự column
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // gọi api cập nhật column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns ) => {
    // console.log('moveCardToDifferentColumn', currentCardId, prevColumnId, nextColumnId, dndOrderedColumns)

    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

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
    return <PageLoadingSpinner caption="Loading Board..." />
  }

  // const deleteCardDetails = (cardId) => {
  //   // update state board
  //   const newBoard = { ...board }

  //   // Tìm column chứa card cần xóa
  //   const columnToUpdate = newBoard.columns.find(column =>
  //     column.cards.some(card => card._id === cardId)
  //   )

  //   if (columnToUpdate) {
  //     // xóa card khỏi mảng cards
  //     columnToUpdate.cards = columnToUpdate.cards.filter(card => card._id !== cardId)
  //     // xóa cardId khỏi cardOrderIds
  //     columnToUpdate.cardOrderIds = columnToUpdate.cardOrderIds.filter(_id => _id !== cardId)

  //     // xử lý column rỗng - thêm placeholder card
  //     if (isEmpty(columnToUpdate.cards)) {
  //       columnToUpdate.cards = [generatePlaceholderCard(columnToUpdate)]
  //       columnToUpdate.cardOrderIds = [generatePlaceholderCard(columnToUpdate)._id]
  //     }
  //   }
  //   // setBoard(newBoard)
  //   dispatch(updateCurrentActiveBoard(newBoard))

  //   // gọi API xoá card
  //   deleteCardDetailsAPI(cardId).then(res => {
  //     toast.success(res?.deleteResult)
  //   })
  // }

  // const updateCardTitle = async (cardId, newTitle) => {
  //   // Backup original state for rollback
  //   const originalBoard = { ...board }

  //   try {
  //     // update state board (optimistic update)
  //     const newBoard = { ...board }
  //     const columnToUpdate = newBoard.columns.find(column =>
  //       column.cards.some(card => card._id === cardId)
  //     )

  //     if (columnToUpdate) {
  //       const cardToUpdate = columnToUpdate.cards.find(card => card._id === cardId)
  //       if (cardToUpdate) {
  //         cardToUpdate.title = newTitle
  //       }
  //     }
  //     // setBoard(newBoard)
  //     dispatch(updateCurrentActiveBoard(newBoard))

  //     // gọi API cập nhật title
  //     await updateCardTitleAPI(cardId, { title: newTitle })
  //     toast.success('Card title updated successfully!')

  //   } catch (error) {
  //     // Rollback state on error
  //     setBoard(originalBoard)
  //     toast.error('Failed to update card title')
  //     // console.error('Error updating card title:', error)
  //   }
  // }

  // const updateColumnTitle = async (columnId, newTitle) => {
  //   // Backup original state for rollback
  //   const originalBoard = { ...board }

  //   try {
  //     // update state board (optimistic update)
  //     const newBoard = { ...board }
  //     const columnToUpdate = newBoard.columns.find(column => column._id === columnId)

  //     if (columnToUpdate) {
  //       columnToUpdate.title = newTitle
  //     }
  //     setBoard(newBoard)

  //     // gọi API cập nhật title
  //     await updateColumnDetailsAPI(columnId, { title: newTitle })
  //     toast.success('Column title updated successfully!')

  //   } catch (error) {
  //     // Rollback state on error
  //     setBoard(originalBoard)
  //     toast.error('Failed to update column title')
  //     // console.error('Error updating column title:', error)
  //   }
  // }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>

      <AppBar/>
      <BoardBar board={board}/>
      <BoardContent
        board={board}

        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveColumns={moveColumns}
        moveCardToDifferentColumn={moveCardToDifferentColumn}

        // deleteCardDetails={deleteCardDetails}
        // updateCardTitle={updateCardTitle}
        // updateColumnTitle={updateColumnTitle}
      />

    </Container>
  )
}

export default Board
