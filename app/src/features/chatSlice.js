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
    form: {
        message: ""
    },
    chatRoom: {
        messages: [],
        users: []
    }
}

export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async (nickname, thunkAPI) => {
        try {
            const { socket, form: { message } } = thunkAPI.getState().chat
            const { user: {u_id} } = thunkAPI.getState().user
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
    async (nickname, thunkAPI) => {
        try {
            const { socket, form: { message } } = thunkAPI.getState().chat
            const { user: {u_id} } = thunkAPI.getState().user
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
            state.form[name]=value
        },
        resetForm: (state, action) => {
            state.form={...initialState.form}
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
    }
})

export const {updateForm,resetForm,updateMessages,updateUsers} = chatSlice.actions

export default chatSlice.reducer