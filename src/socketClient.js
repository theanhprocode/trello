// socket.io client setup
import { io } from 'socket.io-client'
import { SOCKET_URL } from '~/utilities/constants'
export const socketIoInstance = io(SOCKET_URL)