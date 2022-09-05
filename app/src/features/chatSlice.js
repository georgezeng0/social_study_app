import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import socketIO from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const connectSocket = () => {
    // Socket connection with backend
    const socket = socketIO.connect();
    return socket
}

const initialState = {
    isLoading: false,
    error: {
        isError: false,
        message: '',
        status: ''
    },
    socket: connectSocket(),
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


export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async (_, thunkAPI) => {
        try {
            const { socket, form: { message } } = thunkAPI.getState().chat
            const { user: {u_id, nickname} } = thunkAPI.getState().user
            socket.emit('message', {
                message: message,
                name: nickname, // Passed as parameter (retrieved from auth0 user info)
                u_id: u_id,
                m_id: uuidv4(), // Message ID
                socketID: socket.id,
            });
        } catch (error) {
            return error.message
            // Use below if use axios
            // return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
        }
        
    }
)

export const addUser = createAsyncThunk(
    'chat/addUser',
    async (_, thunkAPI) => {
        try {
            const { socket } = thunkAPI.getState().chat
            const { user: {u_id, nickname} } = thunkAPI.getState().user
            socket.emit('newUser', {
                name: nickname, // Passed as parameter (retrieved from auth0 user info)
                u_id: u_id,
                socketID: socket.id,
            });
        } catch (error) {
            return error.message
            // Use below if use axios
            // return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
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
        updateMessages: (state, action) => {
            state.chatRoom.messages=[...state.chatRoom.messages, action.payload]
        },
        updateUsers: (state, action) => {
            state.chatRoom.users=action.payload
        }
    },
    extraReducers: {
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
        },
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
        },
    }
})

export const {updateForm,resetForm,updateMessages,updateUsers,updateRoomForm,resetRoomForm} = chatSlice.actions

export default chatSlice.reducer