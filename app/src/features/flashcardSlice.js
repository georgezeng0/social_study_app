import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    flashcards: [],
    activeCard: {
        card: {},
        index: -1
    },
    isLoading: false,
    error: {
        isError: false,
        message: ''
    },
    formNew: {
        front: '',
        back: ''
    },
    formEdit: {
        front: '',
        back: ''
    }
}

// NB - Flashcards can be populated from the parent set object - avoids another call to API
// Gets flashcards by set
export const getFlashcards = createAsyncThunk(
    'flashcard/getFlashcards',
    async (s_id, thunkAPI) => {
        try {
            const res = await axios(`/api/flashcards/by_set/${s_id}`);
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)

export const getOneFlashcard = createAsyncThunk(
    'flashcard/getOneFlashcard',
    async (f_id, thunkAPI) => {
        try {
            const res = await axios(`/api/flashcards/${f_id}`);
            if (res.data?.parentSet) {
                thunkAPI.dispatch(getFlashcards(res.data.parentSet))
            }
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)

export const createFlashcard = createAsyncThunk(
    'flashcard/createFlashcard',
    async (s_id, thunkAPI) => {
        try {
            const { front, back } = thunkAPI.getState().flashcard.formNew
            const res = await axios.post(`/api/flashcards/new/${s_id}`, { front, back });
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)

export const editFlashcard = createAsyncThunk(
    'flashcard/editFlashcard',
    async (f_id, thunkAPI) => {
        try {
            const { front, back } = thunkAPI.getState().flashcard.formEdit
            const res = await axios.patch(`/api/flashcards/${f_id}`, { front, back });
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)

export const deleteFlashcard = createAsyncThunk(
    'flashcard/deleteFlashcard',
    async (f_id, thunkAPI) => {
        try {
            const res = await axios.delete(`/api/flashcards/${f_id}`);
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)

export const flashcardSlice = createSlice({
    name: 'flashcard',
    initialState,
    reducers: {
        updateForm: (state, { payload }) => {
            const { formType, name, value } = payload;
            state[formType][name]=value
        },
        resetForm: (state, { payload: { formType } }) => {
            state[formType] = {
                front: '',
                back: ''
            }
        },
        setActiveCard: (state, { payload }) => {
            if (state.activeCard.card._id!==payload) {
                state.activeCard.card = state.flashcards.find(card => card._id === payload)
            }
            state.activeCard.index = state.flashcards.reduce((foundIndex, card, i) => {
                if (card._id === payload) {
                    return i
                }
                return foundIndex
            },-1)
        }
    },
    extraReducers: {
        [getFlashcards.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
        },
        [getFlashcards.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.flashcards = action.payload;
        },
        [getFlashcards.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error.message = action.payload
        },
        [getOneFlashcard.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
        },
        [getOneFlashcard.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.activeCard.card = action.payload;
        },
        [getOneFlashcard.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error.message = action.payload
        },
        [createFlashcard.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
        },
        [createFlashcard.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
        },
        [createFlashcard.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error.message = action.payload
        },
        [editFlashcard.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
        },
        [editFlashcard.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
        },
        [editFlashcard.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error.message = action.payload
        },
        [deleteFlashcard.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
        },
        [deleteFlashcard.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
        },
        [deleteFlashcard.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error.message = action.payload
        }
    }
})

export const {updateForm, resetForm,setActiveCard  } = flashcardSlice.actions

export default flashcardSlice.reducer