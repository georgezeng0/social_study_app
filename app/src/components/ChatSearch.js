import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateSearch } from '../features/chatSlice'

const ChatSearch = () => {
    const { search: { name, isPublic } } = useSelector(state => state.chat)
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        dispatch(updateSearch({name,value}))
    }

  return (
      <div className="p-3 row">
          <div className="col"></div>
          <div className="col-6">
            <input type="text" placeholder='Search Room Name'
              value={name} onChange={handleChange} name="name"
              className='form-control'
              />
              </div>
          <label htmlFor="isPublic" className='col-form-label col-2 text-end'>Public Only</label>
          <div className="col-1 d-flex align-items-center">
          <input type="checkbox" id="isPublic" name="isPublic" checked={isPublic} onChange={handleChange} className="form-check-input"/>
          </div>
          <div className="col"></div>
    </div>
  )
}

export default ChatSearch