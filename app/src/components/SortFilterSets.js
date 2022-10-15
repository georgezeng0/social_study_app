import React,{ useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSets, updateFilter, resetFilter } from '../features/setSlice'
import { FaSearch } from 'react-icons/fa'

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
        <div className='w-100'>
            <form onSubmit={handleSubmit} className="row">
                <div className="input-group col-12 col-lg px-1 mb-2 mb-lg-0">
                    <input type="text" name="search" value={search}
                        onChange={handleChange} placeholder="Search..."
                        className='form-control '
                    />
                    <button type="submit"
                        className='btn btn-primary input-group-text'
                    ><FaSearch/></button>
                </div>
                
                <div className="col col-lg-auto"></div>
                <div className="col-auto form-check d-flex flex-column align-items-center px-1">
                    <label htmlFor="favourite"  className=""            
                    >Favourited</label>
                    <input type="checkbox" id="favourite" name="favourite"
                        checked={isFavourite} disabled={user.u_id.length === 0}
                        onChange={handleChange}
                        className=""
                    />
                </div>
                <button type="button" onClick={() => setOpenTags(!openTags)}
                    className='col-auto btn btn-outline-dark mx-1'                
                >Tags</button>
                
                <button type="button" onClick={handleReset}
                    className='col-auto btn btn-outline-dark'
                >Reset</button>
                <div className="col col-lg-auto"></div>
            </form>

            <div className={openTags ? "d-flex" : "d-none"}>
                <TagSelection props={{ tags, tagsList }} />
            </div>
            
            <hr />
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
        <fieldset className='container px-2 mt-3'>
            {/* <legend className='text-center'>Filter By Tag:</legend> */}
            <div className='row'>
        {tagsList.map((tag, i) => {
          return <div key={i} className="col-3 col-md-2 form-check">
            <label htmlFor={tag} className="" style={{fontSize:"0.8rem"}}>{tag}</label>
            <input type="checkbox" id={tag} name="tags" value={tag}
                checked={tags.indexOf(tag) > -1}
                  onChange={handleChange}
                  className="form-check-input"
            />
            </div>            
        })}
                </div>
      </fieldset>
    )
}

export default SortFilterSets