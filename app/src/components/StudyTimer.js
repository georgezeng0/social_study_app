import React,{ useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { startNewTimer, updateTimerForm } from '../features/userSlice'

const StudyTimer = ({ props: { setShowTimer, showTimer } }) => {
    const dispatch = useDispatch()
    const { timer: { form: { studyTimeInput, breakTimeInput, repeatInput },
        startTime, expiresAt, isStudy, studyTime, breakTime, repeat, isPaused }
    } = useSelector(state => state.user)

    const calculateTimeLeft = () => {
        const timeNow = Date.now()
        if (expiresAt) {
            return expiresAt - timeNow
        } 
        return 0
    }

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(startNewTimer())
    }

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        dispatch(updateTimerForm({ name, value }))
    }

    useEffect(() => {
        let timer
        if (expiresAt) {
            
            timer = setInterval(() => { setTimeLeft(calculateTimeLeft()) }, 200)
        }
        return () => {
            clearInterval(timer);
        }
    },[expiresAt])
    

  return (
      <Modal show={showTimer} onHide={() => setShowTimer(false)}>
          <Modal.Header closeButton>
              <Modal.Title>Timer</Modal.Title>
          </Modal.Header> 
          <Modal.Body>
              <div>
                  Time Left: {parseInt(timeLeft/1000)}s
                  <br />
                  Current Period: {isStudy? "Study" : "Break"}
                  <br />
                    Repeats left: {repeat}
              </div>


          <div>
              <form onSubmit={handleSubmit}>
                  <label htmlFor="studyMinutes">Study For : </label>
                   <input id="studyMinutes" type="number" step="1" min="0"
                          name="studyTimeInput"
                          value={studyTimeInput} onChange={handleChange}
                  /> Minutes

                  <br />

                  <label htmlFor="breakMinutes">Break For : </label>
                  <input id="breakMinutes" type="number" step="1" min="0"
                    name="breakTimeInput"
                    value={breakTimeInput} onChange={handleChange}
                  /> Minutes

                  <br />

                  <label htmlFor="repeat">Repeat : </label>
                  <input id="repeat" type="number" step="1" min="0"
                  name="repeatInput"
                  value={repeatInput} onChange={handleChange}
                  /> Times
                  
                  <br />

                  <button>Start</button>

              </form>
              </div>
          </Modal.Body>
    </Modal>
  )
}


export default StudyTimer