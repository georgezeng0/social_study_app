import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialForm = {
    name: '',
    tags: [],
    isPublic: false,
    owner: ''
}
const initialState = {
    isLoading: true,
    error: {
        isError: false,
        status: '',
        message: ''
    },
    success: {
        isSuccess: false,
        successMessage: ''
    },
    sets: [],
    selectedSet: {
        flashcards: []
    },
    formNew: { ...initialForm },
    formEdit: { ...initialForm },
    tagsList: ["General", "Medical and Health", "Science", "History", "Geography", "Language", "Arts", "Movies", "Books", "IT", "Video Games", "Popular Culture"],
    // Fixed tags list? or can this be updated dynamically e.g. database
    // Tags must not contain "+" symbol as used in query string to and backend to split string
    filter: {
        search: '',
        tags: [],
        isFavourite: false
    }
} 

export const getSingleSet = createAsyncThunk(
    'set/getSingleSet',
    async (s_id, thunkAPI) => {
        const {_id} = thunkAPI.getState().user.user
        try {
            const res = await axios(`/api/sets/${s_id}?user=${_id}`);
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
        }
    }
)

// TBD backend logic for pagination
export const getSets = createAsyncThunk(
    'set/getSets',
    async (_, thunkAPI) => {
        const { search, tags, isFavourite } = thunkAPI.getState().set.filter
        const {_id} = thunkAPI.getState().user.user
        let searchQuery = "";
        // Add query string if any search values truthy
        if (search || tags.length > 0 || isFavourite || _id) {
            
            searchQuery = '?'
            if (search) {
                searchQuery = `${searchQuery}search=${search}&`
            }
            if (tags.length > 0) {
                let tagString = ""
                tags.map(tag => {
                    tagString = `${tagString}tags=${tag}&`
                })
                searchQuery = `${searchQuery}${tagString}`
            }
            if (isFavourite) {
                searchQuery=`${searchQuery}isFavourite=${1}&`
            }
            if (_id) {
                searchQuery=`${searchQuery}user=${_id}`
            }
        }
        try {
            const res = await axios(`/api/sets${searchQuery}`);
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
        }
    }
)

export const createSet = createAsyncThunk(
    'set/createSet',
    async ({token}, thunkAPI) => {
        try {
            const form = thunkAPI.getState().set.formNew
            const user = thunkAPI.getState().user.user
            const res = await axios.post(
                '/api/sets/new',
                { ...form, owner: user._id },
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

export const populateSetForm = createAsyncThunk(
    'set/populateSetForm',
    async (s_id, thunkAPI) => {
        try {
            const res = await axios(`/api/sets/${s_id}`);
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
        }
    }
)

export const editSet = createAsyncThunk(
    'set/editSet',
    async ({ s_id, token }, thunkAPI) => {
        try {
            const form = thunkAPI.getState().set.formEdit
            const res = await axios.patch(
                `/api/sets/${s_id}`,
                form,
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

export const deleteSet = createAsyncThunk(
    'set/deleteSet',
    async ({ s_id, token }, thunkAPI) => {
        try {
            const res = await axios.delete(`/api/sets/${s_id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.data?.deletedSet) {
                thunkAPI.dispatch(getSets())
            }
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
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
        updateFilter: (state, { payload: { name, value } }) => {
            if (name === "search") {
                state.filter.search=value
            }
            if (name === "favourite") {
                state.filter.isFavourite=!state.filter.isFavourite
            }
            if (name === "tags") {
                const index = state.filter.tags.indexOf(value)
                if (index>-1) {
                    state.filter.tags.splice(index, 1)
                } else {
                    state.filter.tags.push(value)
                }
            } 
        },
        resetFilter: (state, action) => {
            state.filter={...initialState.filter}
        },
        resetForm: (state, { payload: { formType } }) => {
            state[formType] = { ...initialForm }
        },
        resetError: (state, action) => {
            state.error = { ...initialState.error }
        },
        resetSuccess: (state, action) => {
            state.success = { ...initialState.success }
        },
        resetSelectedSet: (state, action) => {
            state.selectedSet = {...initialState.selectedSet}
        }
    },
    extraReducers: {
        [createSet.pending]: (state) => {
            state.error.isError = false;
            state.success.isSuccess = false;
            state.isLoading = true
        },
        [createSet.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.success = {
                isSuccess: true,
                successMessage: "Set Created - Redirecting..."
            };
            state.selectedSet=action.payload.set
        },
        [createSet.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [getSets.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
            state.success.isSuccess = false;
        },
        [getSets.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.sets = action.payload;
        },
        [getSets.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [deleteSet.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
            state.success.isSuccess = false;
        },
        [deleteSet.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.success = {
                isSuccess: true,
                successMessage: "Set Deleted"
            };
        },
        [deleteSet.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [editSet.pending]: (state) => {
            state.error.isError = false;
            state.success.isSuccess = false;
            state.isLoading = true
        },
        [editSet.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.success = {
                isSuccess: true,
                successMessage: "Set Updated - Redirecting..."
            };
        },
        [editSet.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [getSingleSet.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
            state.success.isSuccess = false;
        },
        [getSingleSet.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.selectedSet=action.payload
        },
        [getSingleSet.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [populateSetForm.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
            state.success.isSuccess = false;
        },
        [populateSetForm.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.formEdit={...action.payload, _id:undefined, __v: undefined}
        },
        [populateSetForm.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        }        
    }
})

export const { updateForm, resetForm, resetError,
    resetSuccess, updateFilter, resetFilter,resetSelectedSet } = setSlice.actions

export default setSlice.reducer