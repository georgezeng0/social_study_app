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
        c_id: '',
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

export const {
    updateForm, resetForm, updateRoomForm, resetRoomForm,
    startConnecting, connectionEstablished, disconnectedSocket
} = chatSlice.actions

export default chatSlice.reducer