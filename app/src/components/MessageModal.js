import React,{ useState,useEffect }  from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const MessageModal = ({message}) => {
    const [show, setShow] = useState(true)

    useEffect(() => {
        setShow(true)
    }, [message])
    
  return (
      <Modal show={show} onHide={() => setShow(false) }>
          {/* <Modal.Header closeButton>
              <Modal.Title></Modal.Title>
          </Modal.Header> */}
          <Modal.Body className='d-flex flex-column justify-content-center align-items-center'>
          {message}

              <Button variant="secondary" onClick={()=>setShow(false)}
              >Close</Button>
          </Modal.Body>
          {/* <Modal.Footer>              
          </Modal.Footer> */}
    </Modal>
  )
}

export default MessageModal