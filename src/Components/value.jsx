import React from "react";

export default function Value(props) {
  
  return (
    
     <div className="radioOptions">
      <label htmlFor={`opt${props.score}${props.select}`}>
        <input
          type="radio"
          id={`opt${props.score}${props.select}`}
          value={props.option}
          name={props.select}
          className="inputTypeRadio"
          onChange={(e) => {props.set(props.select, e.target.value,props.score); props.handleScore(props.select-1,props.score) }} 

          required
          checked={props.obj[props.select]===props.option}
        />
       {props.option} 
      </label>
      </div>
     
    
  );
}
