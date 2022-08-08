import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    isLoading: false,
    error: {
        isError: false,
        message: ''
    },
    sets: [],
    selectedSet: {},
    formNew: {
        name: ''
    },
    formEdit: {
        name: ''
    }
}

export const getSingleSet = createAsyncThunk(
    'set/getSingleSet',
    async (s_id, thunkAPI) => {
        try {
            const res = await axios(`/api/sets/${s_id}`);
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)

export const getSets = createAsyncThunk(
    'set/getSets',
    async (_, thunkAPI) => {
        try {
            const res = await axios('/api/sets');
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)

export const createSet = createAsyncThunk(
    'set/createSet',
    async (_, thunkAPI) => {
        try {
            const { name } = thunkAPI.getState().set.formNew
            const res = await axios.post('/api/sets/new', { name });
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)

export const editSet = createAsyncThunk(
    'set/editSet',
    async (s_id, thunkAPI) => {
        try {
            const { name } = thunkAPI.getState().set.formEdit
            const res = await axios.patch(`/api/sets/${s_id}`, { name });
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)

export const deleteSet = createAsyncThunk(
    'set/deleteSet',
    async (s_id, thunkAPI) => {
        try {
            const res = await axios.delete(`/api/sets/${s_id}`);
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)

export const setSlice = createSlice({
    name: 'Set',
    initialState,
    reducers: {
        updateForm: (state, { payload }) => {
            const { formType, name, value } = payload;
            state[formType][name]=value
        },
        resetForm: (state, { payload: { formType } }) => {
            state[formType] = {
                name:''
            }
        }
    },
    extraReducers: {
        [createSet.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
        },
        [createSet.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
        },
        [createSet.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error.message = action.payload
        },
        [getSets.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
        },
        [getSets.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.sets = action.payload;
        },
        [getSets.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error.message = action.payload
        },
        [deleteSet.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
        },
        [deleteSet.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
        },
        [deleteSet.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error.message = action.payload
        },
        [editSet.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
        },
        [editSet.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
        },
        [editSet.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error.message = action.payload
        },
        [getSingleSet.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
        },
        [getSingleSet.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.selectedSet=action.payload
        },
        [getSingleSet.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error.message = action.payload
        }
    }
})

export const { updateForm, resetForm} = setSlice.actions

export default setSlice.reducer