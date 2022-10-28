import React,{ useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { startNewTimer, updateTimerForm,endTimer, pauseTimer, continueTimer, saveLocalTimerState } from '../features/userSlice'

const StudyTimer = ({ props: { setShowTimer, showTimer,setTimerSummary } }) => {
    const dispatch = useDispatch()
    const { timer: { form: { studyTimeInput, breakTimeInput, repeatInput },
        startTime, expiresAt, isStudy, studyTime, breakTime, repeat, isPaused, timeLeftAtPause }
    } = useSelector(state => state.user)
    const [showForm,setShowForm] = useState(false)

    // Calcuilate time left using expiresAt from redux state
    const calculateTimeLeft = () => {
        const timeNow = Date.now()
        if (expiresAt) {
            const timeLeft = expiresAt - timeNow
            if (timeLeft > 0) {
                return timeLeft
            }
            // if timeLeft <=0 then end Timer if not paused
            if (!isPaused) {
                dispatch(endTimer())
            }
        } 
        return 0
    }

    // Time Left that is displayed
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

    // Updates parent component with timer stats
    useEffect(() => {
        setTimerSummary({
            isPaused,
            timeLeft,
            isStudy,
            repeat
          })
    },[timeLeft])

    // Handles form submit
    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(startNewTimer())
    }

    // Handles form control - redux state
    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        dispatch(updateTimerForm({ name, value }))
    }

    // Handle pause button
    const handlePause = () => {
        if (isPaused) {
            dispatch(continueTimer())
        } else {
            dispatch(pauseTimer())
        }
    }

    // Timer function - runs calculateTimeLeft() every 0.1s
    useEffect(() => {
        let timer
        let localStateSaveTimer
        if (expiresAt && !isPaused) {
            timer = setInterval(() => { setTimeLeft(calculateTimeLeft()) }, 100) // Updates time left every 0.1s
            localStateSaveTimer = setInterval(() => {
                dispatch(saveLocalTimerState())
            }, 5000) // Saves current timer state to localstorage every 5s
        }
        if (isPaused) {
            setTimeLeft(timeLeftAtPause)
            dispatch(saveLocalTimerState())
        }
        return () => {
            // Need to unmount timer with component changes
            clearInterval(timer);
            clearInterval(localStateSaveTimer)
        }
    }, [expiresAt, isPaused, dispatch])
    

  return (
      <Modal show={showTimer} onHide={() => setShowTimer(false)}>
          <Modal.Header closeButton className='bg-primary'>
              <Modal.Title className='text-center display-6'>Timer</Modal.Title>
          </Modal.Header> 
          <Modal.Body>
              <div className='d-flex flex-column align-items-center'>
                  <span>Time Left:</span>
                  <span className='fs-2 mb-1'>{parseInt(timeLeft / 1000 / 60)}m {parseInt((timeLeft / 1000) % 60)}s</span>
                  Current Period: <b>{isStudy? "Study" : "Break"}</b>
                  <span>Repeats left: {repeat}</span>
                  <div className="btn-group d-flex justify-content-center my-2">
                      <button className="btn btn-dark" style={{width:"120px"}} onClick={()=>setShowForm(!showForm)}>New Timer</button>
                      <button className='btn btn-dark' style={{width:"120px"}} type='button' onClick={handlePause} disabled={timeLeft<=0}> {isPaused ? "Continue" : "Pause"}</button>
                  </div>
              </div>

        
          <div className={`${showForm?"d-block":"d-none"}`}>
                  <form onSubmit={handleSubmit} className="d-flex flex-column justify-content-center">
                      <div className='row mb-2'>
                        <label htmlFor="studyMinutes" className='col-4 col-form-label text-end'>Study For : </label>
                        <input id="studyMinutes" type="number" step="1" min="0" max="60"
                                name="studyTimeInput"
                              value={studyTimeInput} onChange={handleChange}
                              className="form-control col"
                          />
                          <span className="text-muted col-2">Min</span>
                        </div>
                 
                      <div className="row mb-2">
                        <label htmlFor="breakMinutes" className='col-4 col-form-label text-end'>Break For : </label>
                        <input id="breakMinutes" type="number" step="1" min="0" max="60"
                        name="breakTimeInput"
                              value={breakTimeInput} onChange={handleChange}
                              className="form-control col"
                          />
                          <span className="col-2 text-muted">Min</span>
                      </div>

                
                      <div className="row mb-2">
                        <label htmlFor="repeat" className='col-4 col-form-label text-end'>Repeat : </label>
                        <input id="repeat" type="number" step="1" min="0"
                        name="repeatInput"
                              value={repeatInput} onChange={handleChange}
                              className="form-control col"
                          />
                          <span className="col-2 text-muted">Times</span>
                      </div>  

                  <button type='submit' className="btn btn-success btn-sm" >Start</button>

              </form>
              </div>
          </Modal.Body>
    </Modal>
  )
}


export default StudyTimer