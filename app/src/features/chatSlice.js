import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import socketIO from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

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
        messages: [],
        users: []
    },
    roomForm: {
        name: ''
    },
    rooms: []
}

export const createRoom = createAsyncThunk(
    'chat/createRoom',
    async ({token}, thunkAPI) => {
        try {
            const { name } = thunkAPI.getState().chat.roomForm
            const { user: {_id} } = thunkAPI.getState().user
            const res = await axios.post('/api/chat',
                {
                    title: name,
                    owner: _id,
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

// Join a chat room 
export const joinRoom = createAsyncThunk(
    'chat/joinRoom',
    async ({c_id, token}, thunkAPI) => {
        try {
            const res = await axios.post(`/api/chat/${c_id}/join`, {
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
        updateRoomForm: (state, {payload: {name,value}}) => {
            state.roomForm[name]=value
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
            state.chatRoom.users=action.payload
        },
        updateUserSockets: (state, action) => {
            const { c_id, userMongoID, socketID } = action.payload
            // c_id is strinified mongoose object id?
            // will need to recode this for background chat functionality
            const ind = state.chatRoom.users.findIndex(item => item.user._id === userMongoID)
            if (ind > -1) {
                state.chatRoom.users[ind].socketID=[...socketID]
            }
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
            state.chatRoom=action.payload
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
            state.chatRoom=action.payload
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
            state.chatRoom=action.payload
        },
        [leaveRoom.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
    }
})

export const {
    updateForm, resetForm, updateRoomForm, resetRoomForm, updateRoomUsers,
    startConnecting, connectionEstablished, disconnectedSocket, updateUserSockets,
} = chatSlice.actions

export default chatSlice.reducer