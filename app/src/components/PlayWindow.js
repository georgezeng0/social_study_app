import { useAuth0 } from '@auth0/auth0-react'
import React, { useEffect, useState }from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { correctCard, incorrectCard,resetGame } from '../features/flashcardSlice'
import { saveGameHistory } from '../features/userSlice'
import getToken from '../utils/getToken'

const PlayWindow = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {f_id} = useParams()
    const { gameMode: { score, correct, incorrect }, flashcards, activeCard: { card: { parentSet } } } = useSelector(state=>state.flashcard)
    const { getAccessTokenSilently } = useAuth0()

    const [isCorrect, setIsCorrect] = useState(false)
    const [isIncorrect, setIsIncorrect] = useState(false)
  
    useEffect(() => {
        if (correct.indexOf(f_id) > -1) {
            setIsCorrect(true)
        } else {
            setIsCorrect(false)
        }
        if (incorrect.indexOf(f_id) > -1) {
            setIsIncorrect(true)
        } else {
            setIsIncorrect(false)
        }
    },[incorrect,correct, f_id])

    return (
      <section className='p-3 bg-dark text-white border-rounded col-lg-8 d-flex flex-column text-center'>
          <h5 className='text-center'>Playing Set</h5>
            <div>Score: <b>{score}/{flashcards.length}</b></div>
            <div>Current Flashcard Result: {isCorrect||isIncorrect?isCorrect?"Correct":"Incorrect":"Unmarked"}</div>
            <div className='h6 mt-3'>Self-score this card: </div>
            <div className="btn-group d-flex justify-content-center">
                <button disabled={isCorrect} onClick={()=>dispatch(correctCard(f_id))} className="btn btn-success">Correct</button>
                <button disabled={isIncorrect}  onClick={()=>dispatch(incorrectCard(f_id))} className="btn btn-danger">Wrong</button>
            </div>
            <div className='d-flex justify-content-end'>
                <button
                    className='btn btn-light mt-3'
                    onClick={async () => {
                const token = await getToken(getAccessTokenSilently)
                dispatch(saveGameHistory({token}))
                dispatch(resetGame())
                setTimeout(() => {
                    navigate(`/sets/${parentSet}`)
                })
            }}>End Session</button>
            </div>
            
    </section>
  )
}

export default PlayWindow