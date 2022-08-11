import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialForm = {
    name: '',
    tags: [],
    isPublic: false,
}

const initialState = {
    isLoading: false,
    error: {
        isError: false,
        message: ''
    },
    sets: [],
    selectedSet: {},
    formNew: initialForm,
    formEdit: initialForm,
    tagsList: ["General", "Medicine", "Science", "History", "Geography", "Language", "Arts", "Movies", "Books", "IT"]
    // Fixed tags list? or can this be updated dynamically e.g. database
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
            const form = thunkAPI.getState().set.formNew
            const res = await axios.post('/api/sets/new', form);
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)

export const populateSetForm = createAsyncThunk(
    'set/populateSetForm',
    async (s_id, thunkAPI) => {
        try {
            const res = await axios(`/api/sets/${s_id}`);
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
            const form = thunkAPI.getState().set.formEdit
            const res = await axios.patch(`/api/sets/${s_id}`, form);
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
            if (name === "tags") {
                const index = state[formType].tags.indexOf(value)
                if (index>-1) {
                    state[formType].tags.splice(index, 1)
                } else {
                    state[formType].tags.push(value)
                }
            } 
            else if (name === "isPublic") {
                state[formType].isPublic=!state[formType].isPublic
            }
            else {
                state[formType][name] = value
            }
        },
        resetForm: (state, { payload: { formType } }) => {
            state[formType] = initialForm
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
        },
        [populateSetForm.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
        },
        [populateSetForm.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.formEdit={...action.payload, _id:undefined, __v: undefined}
        },
        [populateSetForm.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error.message = action.payload
        }        
    }
})

export const { updateForm, resetForm} = setSlice.actions

export default setSlice.reducer