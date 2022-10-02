import React from 'react'
import styled from 'styled-components'

const Landing = () => {
  return (
    <Wrapper>
      <div className='landing-card-container container-fluid py-5'>
        <div className="row">
          <div className="col"></div>
          <div className="landing-card col-md-auto">
            Card Example
          </div>
          <div className="col"></div>
        </div>
        
      </div>
      <div className='landing-info-container container-fluid d-flex flex-column align-items-center'>
        <h1>Title</h1>
        <button>Call to action</button>
        <div className='container feature-container'>
          <div className="row">
            <div className="col feature-item">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt sequi, nam praesentium illo dicta quaerat eius! Commodi quo alias mollitia earum suscipit, eveniet rerum nemo tempore ipsa, ea reiciendis necessitatibus.
            </div>
            <div className="col feature-item">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio totam officia modi minima eligendi soluta nemo maxime ex quo aliquam deleniti exercitationem quia, nam alias recusandae esse doloribus doloremque enim.
            </div>
            <div className="col feature-item">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae quo iure temporibus, soluta adipisci vitae recusandae, consequuntur iste eius et vel rerum id dignissimos minima numquam dicta animi ex similique.
            </div>
</div>
        </div>
        <button>Call to action</button>
      </div>
      <footer className="container-fluid"></footer>

    </Wrapper>
  )
}

const Wrapper = styled.main`
background-color: white;
.landing-card-container{
  background-color: var(--primary-2)
}
.landing-card{
  background-color: white;
  height: 300px;
  width: 500px;
  border: 1px solid black;
}
.landing-info-container{

}
.feature-container{
  height: 500px;
  border: 1px solid red;
}
.feature-item{
  border: 1px solid green;
  height: 400px;
}
footer{
  height: 200px;
  background-color: var(--primary-2)
}
`

export default Landing