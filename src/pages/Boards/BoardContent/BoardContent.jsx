import { mapOrder } from '~/utilities/sorts'
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { DndContext, PointerSensor, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'

function BoardContent({ board }) {
  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250 } })


  // const mySensors = useSensors(pointerSensor)
  const mySensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = (event) => {
    console.log('handleDragEnd: ', event)
    const { active, over } = event

    if (!over) return

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
  }


  return (
    <DndContext onDragEnd={handleDragEnd} sensors={mySensors}>
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
      </Box>
    </DndContext>
  )
}

export default BoardContent
