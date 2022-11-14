import { io } from 'socket.io-client';
import {
    connectionEstablished, disconnectedSocket, updateRoomUsers, updateUserSockets,
    updateMessages, videoResponse, finishUserSync
} from '../features/chatSlice';

const chatMiddleware = store => {
    // Initialise socket - only connect upon logged in user otherwise remain undefined.
    let socket;

    return next => action => {
        // Example socket.send that matches dispatch action
        // if(action.type == "SEND_WEBSOCKET_MESSAGE") {
        //     socket.send(action.payload);
        //     return;
        // }

        // Get redux state 
        const state = store.getState();
        const { user } = state.user

        // emit User connected if logged in (using user returned from getUser action if user exists)
        if (action.type === "user/getUser/fulfilled") {
            // If user is logged in and socket is undefined (not connected)
            if (action.payload?._id && !socket) {
                // Connect socket (dont need to pass url as API will be same domain)
                socket = io();
                socket.on('connect', () => {
                    store.dispatch(connectionEstablished());
                    // Emit user connected 
                    socket.emit("USER_CONNECTED", {
                        userMongoID: action.payload._id,
                    })
                })

                // Client side disconnect event
                socket.on('disconnect', (reason) => {
                    console.log(`Disconnected from websocket, reason: ${reason}`);
                    store.dispatch(disconnectedSocket());
                    // TBD - Handle disconnect logic on backend (remove socket from chatroom users)
                })

                // UPDATE_CLIENT_SINGLE_USER_SOCKETS
                socket.on('UPDATE_CLIENT_SINGLE_USER_SOCKETS', (data) => {
                    store.dispatch(updateUserSockets(data))
                })

                // UPDATE_CLIENT_SOCKET_DISCONNECT
                socket.on('UPDATE_CLIENT_SOCKET_DISCONNECT', (data) => {
                    store.dispatch(updateRoomUsers(data))
                })

                // MESSAGE_RESPONSE - listens for new messages from other users
                socket.on('MESSAGE_RESPONSE', (data) => {
                    store.dispatch(updateMessages(data))
                })

                // VIDEO RESPONSE - control video player
                socket.on('VIDEO_RESPONSE', (data) => {
                    store.dispatch(videoResponse(data))
                })

                // FINISH_SYNC_CHATROOM_USERS - listen for end of syncing chatroom users
                socket.on('FINISH_SYNC_CHATROOM_USERS', (data) => {
                    store.dispatch(finishUserSync(data.chatroom))
                })
            }
        }

        if (socket) {
            // emit user and chatroom data when user joins chatroom
            if (action.type === "chat/joinRoom/fulfilled") {
                const { user: { _id } } = store.getState().user;
                const c_id = action.payload._id
                const users = [...action.payload.users] || []
                // Emit info
                socket.emit("USER_JOIN_ROOM", {
                    userMongoID: _id,
                    socketID: socket.id,
                    c_id: c_id
                })

                // Update socket info - add socket ID to user that joined chat and update state
                const ind = users.findIndex(item => item.user._id === _id)
                if (ind > -1) {
                    const sockets = users[ind].socketID
                    if (sockets.indexOf(socket.id) < 0) {
                        users[ind].socketID.push(socket.id)
                        store.dispatch(updateRoomUsers([users]))
                    }
                }
        
            }

            // Message successfully created on database - emit new message 
            if (action.type === "chat/sendMessage/fulfilled") {
                const message = action.payload;
                socket.emit("NEW_MESSAGE", message)
            }

            // Play video
            if (action.type === "chat/videoControl") {
                const { c_id, actionType, payload } = action.payload
                socket.emit("VIDEO_CONTROL", { chatroom: c_id, actionType, payload })
            }

            // Sync chatroom users online/offline status
            if (action.type === "chat/syncUserSockets") {
                const { c_id } = action.payload
                socket.emit("SYNC_CHATROOM_USERS", { chatroom: c_id })
            }
        
            return next(action)
        }
    }
} 

export default chatMiddleware