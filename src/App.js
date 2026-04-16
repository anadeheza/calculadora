import { useReducer } from 'react'
import DigitButton from './componentes/DigitButton'
import OpButton from './componentes/OpButton'
import './style.css'

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OP: 'choose_op',
  CLEAR: 'clear', 
  DELETE_DIGIT: 'delete_digit',
  EVALUATE: 'evaluate'
}

const INTEGER_FORMATER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,

})

function formatOp(operand) {
  if(operand == null) return
  const [integer, decimal] = operand.split(".")
  if(decimal == null) return INTEGER_FORMATER.format(integer)
  return `${INTEGER_FORMATER.format(integer)}.${decimal}`
}

function reducer(state, {type, payload}) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite) {
        return {
          ...state,
          currentOp: payload.digit,
          overwrite: false
        }
      }
      if(payload.digit === '0' && state.currentOp === '0') {
        return state
      }
      if(payload.digit === '.' && state.currentOp.includes(".")) {
        return state
      }
      return {
        ...state,
        currentOp: `${state.currentOp || ""}${payload.digit}`,
      }
      
    case ACTIONS.CHOOSE_OP:
      if(state.currentOp == null && state.previousOp == null) {
        return state
      }

      if(state.currentOp == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }
      if(state.previousOp == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOp: state.currentOp,
          currentOp: null
        }
      }
      return {
        ...state,
        previousOp: evaluate(state),
        operation: payload.operation,
        currentOp: null
      }

    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.EVALUATE:
        if(
          state.operation == null ||
          state.currentOp == null || 
          state.previousOp == null
        ) {
          return state
        }
        return {
          ...state,
          overwrite: true, 
          previousOp: null,
          operation: null,
          currentOp: evaluate(state)
      }

    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite) {
        return {
          currentOp: null,
          overwrite: false
        }
      }
      if(state.currentOp == null) return state
      if(state.currentOp.length === 1) {
        return {
          ...state,
          currentOp: null
        }
      }
      return {
        ...state,
        currentOp: state.currentOp.slice(0, -1)
      }
  }
}

function evaluate({currentOp, previousOp, operation}) {
  const previous = parseFloat(previousOp)
  const current = parseFloat(currentOp)
  if(isNaN(previous) || isNaN(current)) return ""
  let computation = ""
  switch(operation) {
    case "+":
      computation = previous + current
      break
    case "-":
      computation = previous - current
      break
    case "*":
      computation = previous * current
      break
    case "÷":
      computation = previous / current
      break
      
  }

  return computation.toString()
  
}

function App() {
  const [{currentOp, previousOp, operation}, dispatch] = useReducer(
    reducer, 
    {}
  )
  
  return (
    <div className="calculator-grid">
      <div className="output">
        <div 
          className="previous-op"> {formatOp(previousOp)} {operation}
        </div>
        <div 
          className="current-op">{formatOp(currentOp)}
        </div>
      </div>
      <button 
        className="span-two" 
        onClick={() => dispatch({type: ACTIONS.CLEAR })}
        >
          AC
        </button>
      <button 
        onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT })}
      >
          DEL
      </button>
      <OpButton operation = "÷" dispatch={dispatch}/>
      <DigitButton digit = "1" dispatch={dispatch}/>
      <DigitButton digit = "2" dispatch={dispatch}/>
      <DigitButton digit = "3" dispatch={dispatch}/>
      <OpButton operation = "*" dispatch={dispatch}/>
      <DigitButton digit = "4" dispatch={dispatch}/>
      <DigitButton digit = "5" dispatch={dispatch}/>
      <DigitButton digit = "6" dispatch={dispatch}/>
      <OpButton operation = "+" dispatch={dispatch}/>
      <DigitButton digit = "7" dispatch={dispatch}/>
      <DigitButton digit = "8" dispatch={dispatch}/>
      <DigitButton digit = "9" dispatch={dispatch}/>
      <OpButton operation = "-" dispatch={dispatch}/>
      <DigitButton digit = "." dispatch={dispatch}/>
      <DigitButton digit = "0" dispatch={dispatch}/>
      <button 
        className="span-two" 
        onClick={() => dispatch({type: ACTIONS.EVALUATE })}
        >
          =
        </button>
    </div>
  );
}

export default App;
