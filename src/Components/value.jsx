import React from "react"

export default function Value(props) {
  return (
    <div className="radioOptions">
      <label htmlFor={`opt${props.score}${props.select}`}>
        <input
          type="radio"
          id={`opt${props.score}${props.select}`}
          value={props.option}
          name={props.select}
          className="radioValues"
          onChange={(e) => { props.storeObjectValue(props.select, e.target.value, props.score) }}
          required
          checked={props.obj[props.select] && props.obj[props.select].val == props.option}
        />
        {props.option}
      </label>
    </div>
  )
}
