import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useEffect } from 'react'

import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Settings from '~/pages/Settings/Settings'
import Boards from '~/pages/Boards/index'
import { socketIoInstance } from '~/socketClient'
import { updateOnlineUsers } from '~/redux/onlineUsers/onlineUsersSlice'


const protectedRoute = ({ user }) => {
  if (!user) return <Navigate to="/login" replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()

  useEffect(() => {
    if (currentUser) {
      // Emit userId khi user đã login
      socketIoInstance.emit('FE_USER_ONLINE', currentUser._id)
    }

    // Lắng nghe danh sách user online từ server
    const onUpdateOnlineList = (userIds) => {
      dispatch(updateOnlineUsers(userIds))
    }
    socketIoInstance.on('BE_USER_ONLINE_LIST', onUpdateOnlineList)

    return () => {
      socketIoInstance.off('BE_USER_ONLINE_LIST', onUpdateOnlineList)
    }
  }, [currentUser, dispatch])

  return (
    <Routes>

      <Route path='/' element={
        // replace giá trị true để nó thay thế route /, có thể hiểu là route này sẽ không có trong history Browser
        <Navigate to='/boards' replace={true} />
      } />

      {/* Protected routes (là những route chỉ cho truy cập khi đã đăng nhập) */}
      <Route element={protectedRoute({ user: currentUser })}>
        {/* Board details */}
        <Route path='/boards/:boardId' element={<Board />} />
        <Route path='/boards' element={<Boards />} />

        {/* User Settings */}
        <Route path='/settings/account' element={<Settings />} />
        <Route path='/settings/security' element={<Settings />} />
      </Route>

      {/* Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/account/verification' element={<AccountVerification />} />

      {/* 404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
