// A react-bootstrap modal, which opens on loading async actions.
// Displays the error if there is error.
// Automatically closes if successful async


import React,{ useState, useEffect }  from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Loading from './Loading'

const AsyncModal = ({ props: { isLoading, status, message, isError, isSuccess,successMessage } }) => {
    const [show, setShow] = useState(false)
    
    useEffect(() => {
        if (isLoading) {
            setShow(true)
        } else {
            if (!isError && isSuccess) {
                setTimeout(()=>setShow(false),2000)
            } else if (!isError) {
                setShow(false)
            }
        }
    }, [isLoading, isError])



  return (
      <Modal show={show} onHide={() => { if (!isLoading) setShow(false) }}>
          {/* <Modal.Header closeButton>
              <Modal.Title></Modal.Title>
          </Modal.Header> */}
          <Modal.Body className='d-flex flex-column justify-content-center align-items-center'>
          <h3>{isLoading ? "Loading"  :
                  isError ?
                      `Error, Code ${status}` :
                      !successMessage &&  `Loading`
              }</h3>
              
              {isLoading ? <Loading /> :
                  isError? `${message}` : successMessage || <Loading/>
              }

              {!isLoading && <Button variant="secondary" onClick={()=>setShow(false)}
              >Close</Button>}
          </Modal.Body>
          {/* <Modal.Footer>              
          </Modal.Footer> */}
    </Modal>
  )
}

export default AsyncModal