import { io } from 'socket.io-client';
import { connectionEstablished, disconnectedSocket } from '../features/chatSlice';

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
                    socket.emit("USER_CONNECTED", {
                        userMongoID: action.payload._id,
                    })
                })
                // Client side disconnect event
                socket.on('disconnect', (reason) => {
                    console.log(`Disconnected from websocket, reason: ${reason}`);
                    store.dispatch(disconnectedSocket());
                    // Handle disconnect logic on backend
                })
            }
        }

        if (action.type === "chat/updateForm") {
            // Test
        }
        
        return next(action)
    }
} 

export default chatMiddleware