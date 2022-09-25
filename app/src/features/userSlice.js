import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    user: {
        _id:'',
        u_id: '',
        favSets: [],
        icon: {
            color: '',
            textColor: ''
        },
        setHistory: [],
        name: '',
        nickname: '',
        email: '',
    },
    authProfile: {},
    auth0Form: {
        name: '',
        nickname: '',
        email: '',
    },
    databaseForm: {
        color: '',
        textColor: ''
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
    isLoading: false, //Generic Loading for whole page - used for API calls to backend
    isAPILoading: false, //Loading for third party APIs e.g. Auth0Management API
    isButtonLoading: false, //Loading state for buttons and small components e.g. toggle favourite set button that
    // does not require the entire page to go into loading animation
    
    timer: {
        form: {
            studyTimeInput: 25,
            breakTimeInput: 5,
            repeatInput: 0
        },
        startTime: 0,
        expiresAt: 0,
        isStudy: true,
        studyTime: 0,
        breaktime: 0,
        repeat:0,
        isPaused: false
    }
}

export const getUser = createAsyncThunk(
    'user/getUser',
    async ({ user, token }, thunkAPI) => {
        try {
            const res = await axios.post(
                `/api/users/${user.sub}`,
                {
                    auth0User: user
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
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
        const { name, nickname, email } = thunkAPI.getState().user.auth0Form
        const { name: oldName, nickname: oldNick, email: oldEmail } = thunkAPI.getState().user.authProfile
        // HTTP request only if form has changed
        if (name !== oldName || nickname !== oldNick || email !== oldEmail) {
            try {
                const res = await axios.patch(`/api/users/management/${u_id}`,
                    {
                        name: name || undefined,
                        nickname: nickname || undefined,
                        email: email || undefined,
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
    }
)

export const updateDBUser = createAsyncThunk(
    'user/updateDBUser',
    async ({u_id,token}, thunkAPI) => {
        const { color,textColor } = thunkAPI.getState().user.databaseForm
        try {
            const res = await axios.patch(`/api/users/${u_id}`,
                {
                    icon: {
                        color,
                        textColor,
                    }
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
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
        }
    }
)

export const saveGameHistory = createAsyncThunk(
    'flashcard/saveGameHistory',
    async ({ token }, thunkAPI) => {
        const u_id = thunkAPI.getState().user.user.u_id
        const { activeCard: { card }, gameMode: {score}, flashcards } = thunkAPI.getState().flashcard
        try {
            const res = await axios.post(
                `/api/users/${u_id}/saveGameHistory`,
                {
                    s_id: card.parentSet,
                    date: Date.now(),
                    score: score,
                    totalCards: flashcards.length
                },
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


export const toggleFavSet = createAsyncThunk(
    'flashcard/toggleFavSet',
    async ({ s_id,token }, thunkAPI) => {
        const u_id = thunkAPI.getState().user.user.u_id
        try {
            const res = await axios(
                `/api/users/${u_id}/toggleFavSet/${s_id}`,
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

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUser: (state, action) => {
            state.user = {... initialState.user }
        },
        updateForm: (state, {payload:{name,value}}) => {
            state.auth0Form[name]=value
        },
        updateDBForm: (state, {payload:{name,value}}) => {
            state.databaseForm[name]=value
        },
        resetSuccess: (state, action) => {
            state.success = { ...initialState.success }
        },
        populateDBForm: (state, action) => {
            state.databaseForm = {
                ...state.databaseForm,
                color: state.user.icon.color,
                textColor: state.user.icon.textColor
            }
 
        },
        updateTimerForm: (state, {payload:{name,value}}) => {
            state.timer.form[name]=value
        },
        // timer: {
        //     form: {
        //         studyTimeInput: 25,
        //         breakTimeInput: 5,
        //         repeatInput: 1
        //     },
        //     timeLeft: 0,
        //     isStudy: true,
        //     studyTime: 0,
        //     breaktime: 0,
        //     repeat:0,
        //     isPaused: false
        // }
        startNewTimer: (state, action) => {
            const { studyTimeInput, breakTimeInput, repeatInput } = state.timer.form
            const timeNow = Date.now()
            state.timer.startTime = timeNow
            state.timer.expiresAt = timeNow + studyTimeInput * 60 * 1000 // ms
            state.timer.studyTime = studyTimeInput*60*1000
            state.timer.breaktime = breakTimeInput*60*1000
            state.timer.repeat = repeatInput
        }
    },
    extraReducers: {
        [getUser.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
        },
        [getUser.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.user = { ...state.user, ...action.payload };
        },
        [getUser.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [getUserProfile.pending]: (state) => {
            state.error.isError = false;
            state.isAPILoading = true
        },
        [getUserProfile.fulfilled]: (state, action) => {
            const user = action.payload
            state.isAPILoading = false;
            state.error.isError = false;
            state.authProfile = user;
            state.auth0Form = {
                name: user.name,
                email: user.email,
                nickname: user.nickname,
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
            state.success.isSuccess = true;
            state.authProfile = action.payload.user;
        },
        [updateUserProfile.rejected]: (state, action) => {
            state.isAPILoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [updateDBUser.pending]: (state) => {
            state.error.isError = false;
            state.isAPILoading = true
        },
        [updateDBUser.fulfilled]: (state,action) => {
            state.isAPILoading = false;
            state.error.isError = false;
            state.user = { ...state.user, ...action.payload.updatedUser }
        },
        [updateDBUser.rejected]: (state, action) => {
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
        [saveGameHistory.pending]: (state) => {
            state.error.isError = false;
        },
        [saveGameHistory.fulfilled]: (state, action) => {
            state.error.isError = false;
            state.user = { ...state.user, ...action.payload.user }
        },
        [saveGameHistory.rejected]: (state, action) => {
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [toggleFavSet.pending]: (state) => {
            state.error.isError = false;
            state.isButtonLoading = true;
        },
        [toggleFavSet.fulfilled]: (state, action) => {
            state.error.isError = false;
            state.isButtonLoading = false;
            state.user={ ...state.user, ...action.payload.user }
        },
        [toggleFavSet.rejected]: (state, action) => {
            state.error.isError = true;
            state.isButtonLoading = false;
            state.error = { ...state.error, ...action.payload }
        },
    }
})

export const { clearUser, updateDBForm, updateForm, resetSuccess, populateDBForm,
    updateTimerForm, startNewTimer} = userSlice.actions

export default userSlice.reducer