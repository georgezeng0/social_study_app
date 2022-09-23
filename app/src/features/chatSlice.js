import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    isLoading: false,
    error: {
        isError: false,
        message: '',
        status: ''
    },
    socket: {
        isConnecting: false,
        isConnected: false
    },
    // Message input form
    inputForm: {
        message: ""
    },
    chatRoom: {
        _id: '',
        isPublic: false,
        messages: [],
        users: [],
        videoId: ''
    },
    joinedRooms: [],
    roomForm: {
        name: '',
        isPublic: false,
    },
    rooms: [],
    showEdit: false,
    newMessages: {}, // key is chat_id, value is number of new messages for that chatroom
    videoResponse: {
        type: '',
        payload: null,
    }
}

export const createRoom = createAsyncThunk(
    'chat/createRoom',
    async ({token}, thunkAPI) => {
        try {
            const { name, isPublic } = thunkAPI.getState().chat.roomForm
            const { user: {_id} } = thunkAPI.getState().user
            const res = await axios.post('/api/chat',
                {
                    title: name,
                    owner: _id,
                    isPublic: isPublic
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            if (res.data) {
                thunkAPI.dispatch(getRooms())
            }
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
        }
    }
)

// Get all chatrooms
export const getRooms = createAsyncThunk(
    'chat/getRooms',
    async (_, thunkAPI) => {
        try {
            const res = await axios('/api/chat')
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
        }
    }
)

// Get all chatrooms that user has joined
export const getUserRooms = createAsyncThunk(
    'chat/getUserRooms',
    async ({ u_id, token }, thunkAPI) => {
        try {
            const res = await axios(`/api/chat/userRooms/${u_id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
        }
    }
)

// Gets chat room data
// TBD - if private room, will only return if user has been added by owner
// Or consider password for private room rather than auth stuff
export const getOneChatRoom = createAsyncThunk(
    'chat/getOneChatRoom',
    async ({ token, c_id }, thunkAPI) => {
        try {
            const res = await axios(`/api/chat/${c_id}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
        }
    }
)

// Edit Room details - name, public
export const editRoom = createAsyncThunk(
    'chat/editRoom',
    async ({token,c_id}, thunkAPI) => {
        try {
            const { name, isPublic } = thunkAPI.getState().chat.roomForm
            const res = await axios.patch(`/api/chat/${c_id}`,
                {
                    title: name,
                    isPublic: isPublic
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
        }
    }
)

// Delete Room
export const deleteRoom = createAsyncThunk(
    'chat/deleteRoom',
    async ({token,c_id}, thunkAPI) => {
        try {
            const res = await axios.delete(`/api/chat/${c_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
        }
    }
)

// Join a chat room 
export const joinRoom = createAsyncThunk(
    'chat/joinRoom',
    async ({c_id, token, passcode}, thunkAPI) => {
        try {
            const res = await axios.post(`/api/chat/${c_id}/join`, {
                user: thunkAPI.getState().user.user?._id,
                passcode: passcode
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
        }
    }
)

export const leaveRoom = createAsyncThunk(
    'chat/leaveRoom',
    async({c_id, token}, thunkAPI) => {
        try {
            const res = await axios.post(`/api/chat/${c_id}/leave`, {
                user: thunkAPI.getState().user.user?._id
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
        }
    }
)

export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async ({ token }, thunkAPI) => {
        const mongoUserID = thunkAPI.getState().user.user?._id
        const {chatRoom: {_id: c_id}, inputForm: {message}} = thunkAPI.getState().chat
        try {
            const res = await axios.post(`/api/chat/${c_id}/message`, {
                mongoUserID: mongoUserID,
                body: message
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
        }
    }

)

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        updateForm: (state, {payload: {name,value}}) => {
            state.inputForm[name]=value
        },
        resetForm: (state, action) => {
            state.inputForm={...initialState.inputForm}
        },
        updateRoomForm: (state, { payload: { name, value } }) => {
            if (name === "isPublic") {
                state.roomForm.isPublic = !state.roomForm.isPublic
            } else {
                state.roomForm[name] = value
            }
        },
        resetRoomForm: (state, action) => {
            state.roomForm={...initialState.roomForm}
        },
        startConnecting: (state, action) => {
            state.socket.isConnecting = true;
        },
        connectionEstablished: (state, action) => {
            state.socket.isConnected = true;
            state.socket.isConnecting = false;
        },
        disconnectedSocket: (state, action) => {
            state.socket.isConnected = false;
        },
        updateRoomUsers: (state, action) => {
            const { c_id, updatedUsers }=action.payload
            if (state.chatRoom._id === c_id) {
                state.chatRoom.users = state.chatRoom.users.map((item,i) => {
                    item.socketID = updatedUsers[i].socketID
                    return item
                })
            }
        },
        updateUserSockets: (state, action) => {
            const { c_id, userMongoID, socketID } = action.payload
            // c_id is strinified mongoose object id?
            // will need to recode this for background chat functionality (have a separate property for background chat)
            const ind = state.chatRoom.users.findIndex(item => item.user._id === userMongoID)
            if (ind > -1) {
                state.chatRoom.users[ind].socketID=[...socketID]
            }
        },
        updateMessages: (state, action) => {
            const newMessage = action.payload;
            const messageRoomID=newMessage.chatRoom
            // Check that message is for correct chatroom
            if (state.chatRoom._id === messageRoomID) {
                // Check that message isn't already in messages (should not happen)
                if (state.chatRoom.messages.findIndex(msg => msg._id === newMessage._id) < 0) {
                    state.chatRoom.messages.push(newMessage)
                }             
            }
            // Add message to joined rooms if not in that chatroom route
            state.joinedRooms = state.joinedRooms.map(
                room => {
                    const { _id, messages } = room
                    if (_id === messageRoomID) {
                        if (messages.findIndex(msg => msg._id === newMessage._id) < 0) {
                            messages.push(newMessage)
                        }         
                    }
                    return room
                }
            )
            // New message notificationS
            if (state.newMessages[messageRoomID]) {
                state.newMessages[messageRoomID]+=1
            } else {
                state.newMessages[messageRoomID]=1
            }
        },
        populateRoomForm: (state, action) => {
            state.roomForm = {
                ...state.roomForm,
                name: state.chatRoom.title,
                isPublic: state.chatRoom.isPublic
            }
        },
        toggleShowEdit: (state, action) => {
            state.showEdit= !state.showEdit
        },
        resetMessageCount: (state, action) => {
            state.newMessages[action.payload]=undefined
        },
        videoControl: (state, action) => {
            // Chat middleware will send socket
        },
        videoResponse: (state, action) => {
            const { actionType, payload, c_id } = action.payload
            // Action only for the relevant chatroom
            if (state.chatRoom._id === c_id) {
                state.videoResponse.type = actionType
                state.videoResponse.payload= payload
                if (actionType === "SET_VIDEO_ID") {
                    state.chatRoom.videoId = payload
                }
            }
        },
        resetVideoResponse: (state, action) => {
            state.videoResponse = {...initialState.videoResponse}
        }

    },
    extraReducers: {
        [createRoom.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
        },
        [createRoom.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
        },
        [createRoom.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [getRooms.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
        },
        [getRooms.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.rooms=action.payload
        },
        [getRooms.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [getOneChatRoom.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
        },
        [getOneChatRoom.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.chatRoom = { ...initialState.chatRoom,...action.payload }
        },
        [getOneChatRoom.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [joinRoom.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
        },
        [joinRoom.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.chatRoom={ ...initialState.chatRoom,...action.payload }
        },
        [joinRoom.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [leaveRoom.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
        },
        [leaveRoom.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.chatRoom={ ...initialState.chatRoom,...action.payload }
        },
        [leaveRoom.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [sendMessage.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
        },
        [sendMessage.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
        },
        [sendMessage.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [editRoom.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
        },
        [editRoom.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.chatRoom={ ...initialState.chatRoom,...action.payload }
            state.showEdit=false
        },
        [editRoom.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [deleteRoom.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
        },
        [deleteRoom.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
        },
        [deleteRoom.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [getUserRooms.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
        },
        [getUserRooms.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.joinedRooms = action.payload;
        },
        [getUserRooms.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
    }
})

export const {
    updateForm, resetForm, updateRoomForm, resetRoomForm, updateRoomUsers,
    startConnecting, connectionEstablished, disconnectedSocket, updateUserSockets,
    updateMessages, populateRoomForm, toggleShowEdit, resetMessageCount,
    videoControl, videoResponse,resetVideoResponse
    
} = chatSlice.actions

export default chatSlice.reducer