import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { getSingleSet } from './setSlice'

// Function to shuffle an array in place
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to set state to sessionStorage with key "gameState"
function saveGameState(state) {
    // Store game state in session on each flashcard visit
    state.gameMode.savedCardWithIndex={...state.activeCard}
    sessionStorage.setItem("gameState", JSON.stringify({ ...state }));
}

function getGameState() {
    let data = sessionStorage.getItem("gameState")
    data = JSON.parse(data)
    if (data?.flashcards) {
        if (data.gameMode.savedCardWithIndex?.index) {
            data.activeCard={...data.gameMode.savedCardWithIndex}
        }
        return data
    }
    else {
        return { ...initialState }
    }
}

const initialForm= {
    front: '',
    back: '',
    title: '',
    notes: '',
    reversible: false,
    image: {
        url: '',
        thumb: '',
        publicID: ''
    },
    stats: {
        difficulty: 0,
    },
    owner: ''
}

const initialState = {
    flashcards: [],
    originalFlashcards: [],
    shuffledFlashcards:[],
    activeCard: {
        card: {},
        index: -1
    },
    isLoading: false,
    error: {
        isError: false,
        message: '',
        status: ''
    },
    success: {
        isSuccess: false,
        successMessage: ''
    },
    formNew: initialForm,
    formEdit: initialForm,
    editCard: {},
    gameMode: {
        isPlaying: false,
        score: 0,
        correct: [],
        incorrect: [],
        savedCardWithIndex: {
            card: undefined
        }
    },
    roomWindow: {
        state: 'SETS', //correspounds to the route/view - "SETS","SET","FLASHCARD",
        s_id: '',
        f_id: ''
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
            return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
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
            return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
        }
    }
)

export const populateFlashcardForm = createAsyncThunk(
    'flashcard/populateFlashcardForm',
    async (f_id, thunkAPI) => {
        try {
            const res = await axios(`/api/flashcards/${f_id}`);
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
        }
    }
)

export const createFlashcard = createAsyncThunk(
    'flashcard/createFlashcard',
    async ({ s_id, token }, thunkAPI) => {
        try {
            const form = thunkAPI.getState().flashcard.formNew
            const user = thunkAPI.getState().user.user
            const res = await axios.post(
                `/api/flashcards/new/${s_id}`,
                { ...form, owner: user._id },
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

export const editFlashcard = createAsyncThunk(
    'flashcard/editFlashcard',
    async ({ f_id, token }, thunkAPI) => {
        try {
            const form= thunkAPI.getState().flashcard.formEdit
            const res = await axios.patch(
                `/api/flashcards/${f_id}`,
                { ...form },
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

export const deleteFlashcard = createAsyncThunk(
    'flashcard/deleteFlashcard',
    async ({ f_id, s_id, token }, thunkAPI) => {
        try {
            const res = await axios.delete(
                `/api/flashcards/${f_id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.data?.deletedFlashcard) {
                thunkAPI.dispatch(getFlashcards(s_id));
                thunkAPI.dispatch(getSingleSet(s_id))
            }
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue( {status: error.response.status, message: error.response.data.message });
        }
    }
)

export const flashcardSlice = createSlice({
    name: 'flashcard',
    initialState: getGameState(), // Retrieves an ongoing game if there is one in storage
    reducers: {
        updateForm: (state, { payload }) => {
            const { formType, name, value } = payload;
            if (name === "difficulty") {
                state[formType].stats.difficulty = value
            } else {
                state[formType][name] = value
            }
        },
        resetForm: (state, { payload: { formType } }) => {
            state[formType] = { ...initialState.formNew }
        },
        setActiveCard: (state, { payload: {f_id,roomWindow} }) => {
            if (state.activeCard.card?._id!==f_id) {
                state.activeCard.card = state.flashcards.find(card => card._id === f_id)
            }
            state.activeCard.index = state.flashcards.reduce((foundIndex, card, i) => {
                if (card._id === f_id) {
                    return i
                }
                return foundIndex
            }, -1)
            // Save game state on each flashvard load -only if not in chatroom view
            if (state.gameMode.isPlaying && !roomWindow) {
                saveGameState(state)
            }
        },
        resetSuccess: (state, action) => {
            state.success = { ...initialState.success }
        },
        playSet: (state, action) => {
            state.gameMode = {
                ...state.gameMode,
                isPlaying: true,
                score: 0,
                correct: [],
                incorrect: []
            }
            state.originalFlashcards = [...action.payload]
            const cards = [...action.payload]
            shuffleArray(cards) // shuffle array in place
            state.flashcards = cards
            state.shuffledFlashcards = [...cards]
            state.activeCard.card = cards[0]
        },
        correctCard: (state, action) => {
            // If card isn't already marked as correct - add to correct and remove from incorrect if in incorrect
            if (state.gameMode.correct.indexOf(action.payload) < 0) {
                state.gameMode.correct.push(action.payload)
                state.gameMode.score += 1
                const incorrectIndex = state.gameMode.incorrect.indexOf(action.payload) 
                if (incorrectIndex > -1) {
                    state.gameMode.incorrect.splice(incorrectIndex,1)
                }
            }
            // Update store
            if (state.gameMode.isPlaying) {
                saveGameState(state)
            }
        },
        incorrectCard: (state, action) => {
            // If card isn't already marked as incorrect - add to incorrect and remove from correct if in correct
            if (state.gameMode.incorrect.indexOf(action.payload) < 0) {
                state.gameMode.incorrect.push(action.payload)
                const correctIndex = state.gameMode.correct.indexOf(action.payload) 
                if (correctIndex > -1) {
                    state.gameMode.correct.splice(correctIndex, 1)
                    state.gameMode.score -= 1
                }
            }
            // Update store
            if (state.gameMode.isPlaying) {
                saveGameState(state)
            }
        },
        resetGame: (state, action) => {
            state.gameMode = { ...initialState.gameMode }
            saveGameState(state)
        },
        updateRoomWindow: (state, action) => {
            state.roomWindow = { ...state.roomWindow, ...action.payload }
        },
        setFlashcardsState: (state, action) => {
            const type = action.payload
            if (type === "ORIGINAL") {
                state.flashcards = [...state.originalFlashcards]
                if (state.activeCard.card?._id && state.gameMode.isPlaying) {
                    state.gameMode.savedCardWithIndex={...state.activeCard}
                    saveGameState(state)
                }
            }
            if (type === "SHUFFLED") {
                state.flashcards = [...state.shuffledFlashcards]
                state.activeCard = { ...state.gameMode.savedCardWithIndex }
                state.roomWindow.state="SET"
            }
        },
        resetError: (state, action) => {
            state.error = { ...initialState.error }
        }
    },
    extraReducers: {
        [getFlashcards.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
            state.success.isSuccess = false;
        },
        [getFlashcards.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.flashcards = action.payload;
        },
        [getFlashcards.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [getOneFlashcard.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
            state.success.isSuccess = false;
        },
        [getOneFlashcard.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.activeCard.card = action.payload;
        },
        [getOneFlashcard.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [createFlashcard.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
            state.success.isSuccess = false;
        },
        [createFlashcard.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.activeCard.card=action.payload.flashcard
            state.success = {
                isSuccess: true,
                successMessage: "Flashcard Created - Redirecting..."
            };
        },
        [createFlashcard.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [editFlashcard.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
            state.success.isSuccess = false;
        },
        [editFlashcard.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.success = {
                isSuccess: true,
                successMessage: "Flashcard Updated - Redirecting..."
            };
        },
        [editFlashcard.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [deleteFlashcard.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
            state.success.isSuccess = false;
        },
        [deleteFlashcard.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.success = {
                isSuccess: true,
                successMessage: "Flashcard Deleted"
            };
        },
        [deleteFlashcard.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        },
        [populateFlashcardForm.pending]: (state) => {
            state.error.isError = false;
            state.isLoading = true
            state.success.isSuccess = false;
        },
        [populateFlashcardForm.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.error.isError = false;
            state.formEdit = {...action.payload, _id: undefined, __v: undefined}
        },
        [populateFlashcardForm.rejected]: (state, action) => {
            state.isLoading = false;
            state.error.isError = true;
            state.error = { ...state.error, ...action.payload }
        }
    }
})

export const { updateForm, resetForm, resetError, resetGame, setActiveCard, resetSuccess,
    playSet, correctCard, incorrectCard, updateRoomWindow, setFlashcardsState } = flashcardSlice.actions

export default flashcardSlice.reducer