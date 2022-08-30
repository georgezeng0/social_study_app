import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    user: {
        u_id: '',
        favSets: [],
    },
    authProfile: {},
    form: {
        name: '',
        nickname: '',
        email: '',
        picture: ''
    },
    error: {
        isError: false,
        message: '',
        status: ''
    },
    success: {
        isSuccess: false,
        successMessage: '',
        resetPasswordSuccess: false
    },
    isLoading: false,
    isAPILoading: false
}

export const getUser = createAsyncThunk(
    'user/getUser',
    async (u_id, thunkAPI) => {
        try {
            const res = await axios(`/api/users/${u_id}`);
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
        }
    }
)

export const getUserProfile = createAsyncThunk(
    'user/getUserProfile',
    async ({ u_id, token }, thunkAPI) => {
        try {
            const res = await axios(`/api/users/management/${u_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
        }
    }
)

export const updateUserProfile = createAsyncThunk(
    'user/updateUserProfile',
    async ({ token }, thunkAPI) => {
        const u_id = thunkAPI.getState().user.user.u_id
        const { name, nickname, email, picture } = thunkAPI.getState().user.form
        try {
            const res = await axios.patch(`/api/users/management/${u_id}`,
                {
                    name: name || undefined,
                    nickname: nickname || undefined,
                    email: email || undefined,
                    picture: picture || undefined
                },
                {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
        }
    }
)

export const resetPasswordEmail = createAsyncThunk(
    'user/resetPasswordEmail',
    async (email, thunkAPI) => {
        try {
            const res = await axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/dbconnections/change_password`, 
                {
                    client_id: process.env.REACT_APP_AUTH0_CLIENTID,
                    email: email,
                    connection:  'Username-Password-Authentication'
                });
            console.log(res);
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
        }
    }
)


export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUser: (state, action) => {
            state.user = {... initialState.user }
        },
        updateForm: (state, {payload:{name,value}}) => {
            state.form[name]=value
        },
        resetSuccess: (state, action) => {
            state.success = { ...initialState.success }
        }
    },
    extraReducers: {
        [getUser.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
            state.success.isSuccess = false;
        },
        [getUser.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.user = action.payload[0];
        },
        [getUser.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [getUserProfile.pending]: (state) => {
            state.error.isError = false;
            state.isAPILoading = true
            state.success.isSuccess = false;
        },
        [getUserProfile.fulfilled]: (state, action) => {
            const user = action.payload
            state.isAPILoading = false;
            state.error.isError = false;
            state.authProfile = user;
            state.form = {
                name: user.name,
                email: user.email,
                nickname: user.nickname,
                picture: user.picture
            }
        },
        [getUserProfile.rejected]: (state, action) => {
            state.isAPILoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [updateUserProfile.pending]: (state) => {
            state.error.isError = false;
            state.isAPILoading = true
            state.success.isSuccess = false;
        },
        [updateUserProfile.fulfilled]: (state,action) => {
            state.isAPILoading = false;
            state.error.isError = false;
            state.authProfile = action.payload.user;
        },
        [updateUserProfile.rejected]: (state, action) => {
            state.isAPILoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [resetPasswordEmail.pending]: (state) => {
            state.error.isError = false;
            state.success.resetPasswordSuccess = false;
        },
        [resetPasswordEmail.fulfilled]: (state, action) => {
            state.error.isError = false;
            if (action.payload = "We've just sent you an email to reset your password.") {
                state.success.resetPasswordSuccess = true;
            }
        },
        [resetPasswordEmail.rejected]: (state, action) => {
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
    }
})

export const {clearUser,updateForm,resetSuccess } = userSlice.actions

export default userSlice.reducer