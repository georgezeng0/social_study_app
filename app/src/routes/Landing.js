import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { FlashcardLanding } from '../components'
import { BsGithub } from 'react-icons/bs'
import breakpoints from '../utils/breakpoints'

const Landing = () => {
  const navigate= useNavigate()

  return (
    <Wrapper>
      <div className='title-container container-fluid pt-3 pb-3'>
        <h1 className='text-center fw-bold'>RoteMate</h1>
        <h5 className='text-center'>A flashcard app with chatrooms</h5>
        <h5 className='text-center'>Even repetitive learning can be social and fun!</h5>
        </div>
      <div className='landing-card-container container-fluid pt-2 pb-4 d-flex flex-column align-items-center'>
        <div className="row">
          <div className="col"></div>
          <div className="landing-card col-md-auto">
            <FlashcardLanding/>
          </div>
          <div className="col"></div>
        </div>
        <button className='mt-5 btn btn-lg btn-dark' type="button"
          onClick={()=>navigate('/flashcards')}
        >Start Learning</button>
        
      </div>
      <div className='landing-info-container container-fluid d-flex flex-column align-items-center'>
        <h2 className='py-3'>Your mate for rote learning</h2>
        
        <div className='container feature-container'>
          <div className="feature-container-row row d-flex justify-content-center">
            <div className="col-md feature-item my-2 my-md-0 mx-md-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt sequi, nam praesentium illo dicta quaerat eius! Commodi quo alias mollitia earum suscipit, eveniet rerum nemo tempore ipsa, ea reiciendis necessitatibus.
            </div>
            <div className="col-md feature-item middle-item my-2 my-md-0 mx-md-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio totam officia modi minima eligendi soluta nemo maxime ex quo aliquam deleniti exercitationem quia, nam alias recusandae esse doloribus doloremque enim.
            </div>
            <div className="col-md feature-item my-2 my-md-0 mx-md-2">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae quo iure temporibus, soluta adipisci vitae recusandae, consequuntur iste eius et vel rerum id dignissimos minima numquam dicta animi ex similique.
            </div>
          </div>
        </div>
        <button className='my-4 btn btn-lg btn-outline-dark' type="button"
          onClick={()=>navigate('/flashcards')}
        >Start Learning</button>
      </div>
      <footer className="container-fluid text-center py-5 d-flex flex-column">
        <a href="https://github.com/georgezeng0/social_study_app" target="_blank"
          className='fs-3 github-icon'        
        ><BsGithub /></a>
        © RoteMate 2022
      </footer>

    </Wrapper>
  )
}

const Wrapper = styled.main`
background-color: white;
.title-container{
  background-color: var(--primary-2)
}
.landing-card-container{
  background-color: var(--primary-2)
}
.landing-card{
  background-color: transparent;
  height: 300px;
  width: 500px;
}
/* .landing-info-container{

} */
.feature-container{
  height: auto;
  transition: all 0.5s;
  @media (max-width: ${breakpoints.md}){
    transition: none;
  }
}
.feature-item{
  border-radius: 20px;
  padding: 1.5rem;
  height:auto;
  max-width: 300px;
  min-height: 300px;
  border: 2px solid var(--primary-4);
}
.middle-item{
  background-color: var(--primary-4);
  color: white;
}
footer{
  height: 200px;
  background-color: var(--primary-2)
}
footer a {
  color: black;
}
`

export default Landing