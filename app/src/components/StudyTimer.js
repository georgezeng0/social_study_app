import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const StudyTimer = () => {
    const dispatch = useDispatch()
    const {timer: {form: {studyTime,breakTime}}} = useSelector(state=>state.user)

    const handleSubmit = (e) => {
        e.preventDefault()
    }

  return (
      <div>
          <h4>Timers</h4>
          <div>
              <form onSubmit={handleSubmit}>
                  <label htmlFor="studyMinutes">Study For : </label>
                  <input id="studyMinutes" type="number" step="1" min="0"
                  
                  /> Minutes

                  <br />

                  <label htmlFor="studyMinutes">Break For : </label>
                  <input id="studyMinutes" type="number" step="1" min="0"
                  
                  /> Minutes

                  <br />
                  
                  <button>Start</button>

              </form>
          </div>
    </div>
  )
}

export default StudyTimer