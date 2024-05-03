import React from 'react'
import NavBar from '../NavBar'
import PageContent from '../layouts/PageContent';
const index = ( {children} ) => {
  return (
    <div className='container'>    
      <NavBar/>
      <PageContent children={children}/>
    </div>
  )
}

export default  index;
