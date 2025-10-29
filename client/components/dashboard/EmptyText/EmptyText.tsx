import React from 'react'

function EmptyText({textToDisplay} : {textToDisplay : string}) {
  return (
    <h1 className='empty-text'>{textToDisplay}</h1>
  )
}

export default EmptyText