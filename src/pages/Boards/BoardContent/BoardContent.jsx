import { mapOrder } from '~/utilities/sorts'
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { DndContext,
  // PointerSensor,
  // closestCenter,
  pointerWithin,
  useSensor,
  useSensors,
  // MouseSensor,
  // TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  // rectIntersection,
  getFirstCollision } from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibraries/dndKitSensors'
import { useEffect, useState, useCallback, useRef } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utilities/formatters'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board, createNewColumn, createNewCard }) {
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, distance: 10 } })


  // const mySensors = useSensors(pointerSensor)
  const mySensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  // cùng 1 thời điểm chi 1 được kéo(column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  // điểm va chạm cuối cùng
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  // Tìm column theo cardId
  const findColoumnCardId = (CardId) => {
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(CardId))
  }

  // Cập nhật lại state trong trường hợp di chuyển card giữa các column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
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

      // Column cũ
      if (nextActiveColumn) {
        // Xóa card đang kéo ra khỏi column ban đầu
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // thêm Placeholder Card nếu Column rỗng (trong 1 column mà card bị kéo hết đi)
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        // Cập nhật lại mảng cardOrderIds
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      // Column mới
      if (nextOverColumn) {
        //nếu card đang kéo có ở overColumn thì xóa nó
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        //thêm card đang kéo vào overColumn vào vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        // Xóa PlaceholderCard
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)

        // cập nhật lại mảng cardOrederId
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)

      }
      // console.log('nextColumns: ', nextColumns)

      return nextColumns
    })
  }

  // khi kéo phần tử
  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    // nếu kéo card thì mới set giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColoumnCardId(event?.active?.id))
    }

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
      moveCardBetweenDifferentColumns(overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }

    // console.log('activeColumn: ', activeColumn)
    // console.log('overColumn: ', overColumn)
  }

  // khi thả phần tử
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)
    const { active, over } = event

    if (!active || !over) return //return nếu không phải active & over

    // Xử lý dnd card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCardId là card đang được kéo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCardId là card đang được activeDraggingCard kéo đến
      const { id: overCardId } = over

      // Tìm 2 cái columns theo cardId
      const activeColumn = findColoumnCardId(activeDraggingCardId)
      const overColumn = findColoumnCardId(overCardId)

      if (!activeColumn || !overColumn) return

      // console.log('oldColumnWhenDraggingCard: ', oldColumnWhenDraggingCard)
      // console.log('overColumn: ', overColumn)
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // lấy vị trí cũ từ active
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // lấy vị trí mới từ over
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)

        const dndorderedCard = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        setOrderedColumns(prevColumns => {
          const nextColumns = cloneDeep(prevColumns)

          const targetColumn = nextColumns.find(column => column._id === overColumn._id)

          targetColumn.cards = dndorderedCard
          targetColumn.cardOrderIds = dndorderedCard.map(card => card._id)
          // console.log(targetColumn)

          return nextColumns
        })
      }
    }

    // Xử lý dnd column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && active.id !== over.id) {
      // lấy vị trí cũ từ active
      const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
      // lấy vị trí mới từ over
      const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)
      // dnd after
      const dndorderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)

      // Use for Database
      // const dndorderedColumnsIds = dndorderedColumns.map(c => c._id)
      // console.log('dndorderedColumns: ', dndorderedColumns)
      // console.log('dndorderedColumnsIds: ', dndorderedColumnsIds)

      setOrderedColumns(dndorderedColumns)
    }

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
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

  const collisionDetectionStrategy = useCallback((args) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    // Tìm các điểm giao nhau va chạm với các con trỏ
    const pointerIntersections = pointerWithin(args)
    if (!pointerIntersections?.length) return
    // thuật toán phát hiện va chạm
    // const intersections = !!pointerIntersections?.length ? pointerIntersections : rectIntersection(args)

    // tìm overId đầu tiên trong intersections
    let overId = getFirstCollision(pointerIntersections, 'id')
    // console.log('overId: ', overId)

    if (overId) {
      const checkColumn = orderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    return lastOverId.current ? [{ id: lastOverId.current }] : []

  }, [activeDragItemType, orderedColumns])

  return (
    <DndContext
      sensors={mySensors}

      // fix thuật toán va chạm với card khác column
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}

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
        <ListColumns columns={orderedColumns} createNewColumn={createNewColumn} createNewCard={createNewCard} />
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
