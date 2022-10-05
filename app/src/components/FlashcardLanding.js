import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const FlashcardLanding = () => {
    const [cardFront, setCardFront] = useState('')
    const [cardBack, setCardBack] = useState('')
    const [cardState, setCardState] = useState({
        flip: false
    })

    // Example Card to show
    const card = {
        front: 'What is the definition of rote?',
        back: "Mechanical or habitual repetition of something to be learned."
    }

    // Reset notes show on card change. Flip is not reset, but content shown varies on flip state.
    // So that the front card is always shown first
    useEffect(() => {
        setCardState({
            // flip: false,
            ...cardState,
        })
        if (cardState.flip) {
            setCardFront(card?.back)
            setCardBack(card?.front)
        } else {
            setCardFront(card?.front)
            setCardBack(card?.back)
        }
    }, [])
    
    // Flip card every time interval automatically
    useEffect(() => {
        let interval
        interval = setInterval(() => {
            setCardState({...cardState, flip: !cardState.flip})
        }, 5000) 
        return ()=>clearInterval(interval)
    }, [cardState])

    return (
        <Wrapper onClick={()=>setCardState({...cardState, flip: !cardState.flip})}>
            {/* <div>
                <button onClick={()=>setCardState({...cardState, flip: !cardState.flip})}>Flip Card</button>
            </div> */}

            <div className={`_flip-card `}>
                <div className={`_flip-card-inner ${cardState.flip?"_flip-action":''}`}>
                {/* Flip Card container for animation */}
          <div className="card _flip-front">
            <article className='card-body container d-flex align-items-center justify-content-center text-center fs-3' dangerouslySetInnerHTML={{__html: cardFront}}>
                </article>
            </div>
  
            <div className={`card _flip-back`}>
            <article className={`card-body container d-flex align-items-center justify-content-center text-center fs-3`} dangerouslySetInnerHTML={{__html: cardBack}}>
                </article>
                </div></div></div>

        </Wrapper>
    )
}

const Wrapper = styled.section`
height: 100%;
:hover{
    cursor: pointer;
}
._flip-card{
    background-color: transparent;
    perspective: 5000px;
    height: 100%;
}
._flip-card-inner{
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.7s;
    transform-style: preserve-3d;
}
._flip-front,._flip-back{
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
 }

._flip-back{
    transform: rotateY(180deg);
}
._flip-action{
  transform: rotateY(180deg);
}
.card{
    height: 100%;
    width: 100%;
}
.card-body{
    height: 100%;
}

`

export default FlashcardLanding