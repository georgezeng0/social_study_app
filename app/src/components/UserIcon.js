import React from 'react'
import styled from 'styled-components'

const UserIcon = ({name="", color="lightblue", textColor="white", height="100px", width="100px"}) => {
  return (
      <Wrapper height={height} width={width} color={color} textColor={textColor}
          className="d-flex justify-content-center align-items-center">
          <p className='display-2 my-auto'>{name.trim()[0]}</p>
          </Wrapper>
  )
}

const Wrapper = styled.div`
background-color: ${props=>props.color};
height: ${props=>props.height};
width: ${props => props.width};
p {
    color: ${props => props.textColor};
}
`

export default UserIcon