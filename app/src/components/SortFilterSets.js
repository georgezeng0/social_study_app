import React,{ useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSets, updateFilter,resetFilter } from '../features/setSlice'

const SortFilterSets = () => {
    const dispatch = useDispatch()
    const { filter: { search, tags, isFavourite }, tagsList } = useSelector(state => state.set)
    const { user } = useSelector(state => state.user)
    const [openTags, setOpenTags] = useState(false)
    
    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(getSets())
    }

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        dispatch(updateFilter({name,value}))
    }

    const handleReset = () => {
        dispatch(resetFilter())
        dispatch(getSets())
    }

    return (
        <div>
        <form onSubmit={handleSubmit}>
          <input type="text" name="search" value={search} onChange={handleChange} placeholder="Search..." />
          <button type="button" onClick={()=>setOpenTags(!openTags)}>View Tags</button>
          <label htmlFor="favourite">My Favourites</label>
          <input type="checkbox" id="favourite" name="favourite" checked={isFavourite} disabled={user.u_id.length === 0}
              onChange={handleChange} />
          <button type="submit">Search</button>
          <button type="button" onClick={handleReset}>Reset</button>
            </form>
            <div className={openTags ? "d-flex" : "d-none"}>
                <TagSelection props={{ tags, tagsList }} />
            </div>
            
        </div>
  )
}

const TagSelection = ({ props: { tags, tagsList } }) => {
    const dispatch = useDispatch()
    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        dispatch(updateFilter({name,value}))
    }
    
    return (
        <fieldset>
        <legend>Filter By Tag:</legend>
        {tagsList.map((tag, i) => {
          return <div key={i}>
            <label htmlFor={tag}>{tag}</label>
            <input type="checkbox" id={tag} name="tags" value={tag}
                checked={tags.indexOf(tag) > -1}
                onChange={handleChange}
            />
            </div>
          })}
      </fieldset>
    )
}

export default SortFilterSets