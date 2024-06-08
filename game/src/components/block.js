import React from 'react'

export default function Block({ isAlive, toggleCell }) {
  return (
    <div onClick={toggleCell} 
        className='w-4 h-4 border border-black' style={{
        width: '16px',
        height: '16px',
        border: '1px solid black',
        backgroundColor: isAlive ? 'black' : 'white',
        boxSizing: 'border-box',
      }}>
        
    </div>
  )
}

