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
      <section>
          <h5>Playing Set</h5>
            <span>Score: {score}/{flashcards.length}</span>
            <span>Card Result: {isCorrect||isIncorrect?isCorrect?"Correct":"Incorrect":"Unmarked"}</span>
          <div>Self-score this card:
                <button disabled={isCorrect} onClick={()=>dispatch(correctCard(f_id))}>Correct</button>
                <button disabled={isIncorrect}  onClick={()=>dispatch(incorrectCard(f_id))}>Wrong</button>
            </div>
            <button onClick={async () => {
                const token = await getToken(getAccessTokenSilently)
                dispatch(saveGameHistory({token}))
                dispatch(resetGame())
                setTimeout(() => {
                    navigate(`/sets/${parentSet}`)
                })
            }}>End Session</button>
    </section>
  )
}

export default PlayWindow