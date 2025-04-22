import { mapOrder } from '~/utilities/sorts'
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { DndContext, PointerSensor, useSensor, useSensors, MouseSensor, TouchSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep } from 'lodash'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, distance: 500 } })


  // const mySensors = useSensors(pointerSensor)
  const mySensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  // cùng 1 thời điểm chi 1 được kéo(column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  // Tìm column theo cardId
  const findColoumnCardId = (CardId) => {
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(CardId))
  }

  // khi kéo phần tử
  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    // console.log('setActiveDragItemId: ', event)
    // console.log('setActiveDragItemType: ', event)
    // console.log('setActiveDragItemData: ', event)
  }

  //
  const handleDragOver = (event) => {
    // Không làm gì nếu đang kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // Xử lý kéo card qua các column
    // console.log('handleDragOver: ', event)
    const { active, over } = event

    if (!active || !over) return //return nếu không phải active & over


    // activeDraggingCard là card đang được kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCardId là card đang được activeDraggingCard kéo đến
    const { id: overCardId } = over

    // Tìm 2 cái columns theo cardId
    const activeColumn = findColoumnCardId(activeDraggingCardId)
    const overColumn = findColoumnCardId(overCardId)

    if (!activeColumn || !overColumn) return

    // Chỉ xử lý khi kéo khi 2 card ở 2 column khác nhau
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns(prevColumns => {
        // Tìm id của overCard
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

        // Logic tính toán để xác định thả vào trên hay dưới overCard
        let newCardIndex
        const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

        const nextColumns = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

        console.log(nextActiveColumn)

        if (nextActiveColumn) {
          // Xóa card đang kéo ra khỏi column ban đầu
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

          // Cập nhật lại mảng cardOrderIds
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }

        if (nextOverColumn) {
          //
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

          //
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)

          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)

        }

        return nextColumns
      })
    }

    // console.log('activeColumn: ', activeColumn)
    // console.log('overColumn: ', overColumn)
  }

  // khi thả phần tử
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log('hanh dong keo tha card - tam thoi ko lam j')
      return
    }

    const { active, over } = event

    if (!active || !over) return //return nếu không phải active & over

    if (active.id !== over.id) {
      // get oldIndex from active
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      // get newIndex from over
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)
      // dnd after
      const dndorderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)

      // Use for Database
      // const dndorderedColumnsIds = dndorderedColumns.map(c => c._id)
      // console.log('dndorderedColumns: ', dndorderedColumns)
      // console.log('dndorderedColumnsIds: ', dndorderedColumnsIds)

      setOrderedColumns(dndorderedColumns)
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  // animation của chức năng overlay
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  return (
    <DndContext
      sensors={mySensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode) === 'dark' ? '#34495e' : '#1676d2',
        width: '100%',
        height: (theme) => theme.customStyles.boardContentHeight,
        p: '10px 0',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={dropAnimation}>
          {(!activeDragItemType) && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
