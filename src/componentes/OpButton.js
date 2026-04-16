import React from 'react'
import { ACTIONS } from '../App'
import { type } from '@testing-library/user-event/dist/type'


export default function OpButton({dispatch, operation}) {
  return(
    <button 
      onClick ={() => dispatch({type: ACTIONS.CHOOSE_OP, payload: {operation} })}
    >
      {operation}
    </button>
  )
}
