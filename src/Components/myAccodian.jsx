import React from "react"
import Value from "./value"

export default function MyAccodian(props) {
  return (
    <>
      {props.data && props.data.map((currentElement, index) => {
        return <div className="innerContainer" key={index + 2 * props.currentPage - 1}>
          <div className="questions" >
            {currentElement.serialNo}
            {". "}
            {currentElement.question}{" "}
          </div>
          <div>
            {
              currentElement.choices.map((id) => {
                const { score } = id
                return <Value
                  key={score}
                  {...id}
                  select={index + 2 * props.currentPage - 1}
                  storeObjectValue={props.storeObjectValue}
                  obj={props.obj}
                />
              })
            }
          </div>
        </div>
      })}
    </>
  )
}
