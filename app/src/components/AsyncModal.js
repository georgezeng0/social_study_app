// A react-bootstrap modal, which opens on loading async actions.
// Displays the error if there is error.
// Automatically closes if successful async


import React,{ useState, useEffect }  from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Loading from './Loading'

const AsyncModal = ({ props: { isLoading, status, message, isError } }) => {
    const [show, setShow] = useState(false)
    
    useEffect(() => {
        if (isLoading) {
            setShow(true)
        } else {
            if (!isError) {
                setTimeout(()=>setShow(false),500)
            }
        }
    }, [isLoading, isError])

  return (
      <Modal show={show} onHide={() => { if (!isLoading) setShow(false) }}>
          <Modal.Header closeButton>
              <Modal.Title>{!isError ? "Loading" :
                   `Error, Code ${status}`
                  }</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              {!isError ? <Loading /> :
                  `${message}`
  }
          </Modal.Body>
          <Modal.Footer>
              {!isLoading && <Button variant="secondary" onClick={()=>setShow(false)}
              >Close</Button>}
          </Modal.Footer>
    </Modal>
  )
}

export default AsyncModal