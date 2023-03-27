import React from "react";
import Value from "./value";

export default function MyAccodian(props) {

  return (
    <>
      {props.data.map((curEle, i) => {
        return <div className="innerContainer" key={i+2*props.currentPage-1}>
         
            <div className="questions" >
              {curEle.serialNo}
              {". "}
              {curEle.question}{" "}
            </div>

          <div>
              {curEle.choices.map((id) => {
                const { score } = id;

                return <Value key={score} {...id} select={i+2*props.currentPage-1} set={props.set} handleScore={props.handleScore} obj={props.obj}
                />;
              })}
              </div>
            
          
        </div>
      })}
    </>
  );
}
