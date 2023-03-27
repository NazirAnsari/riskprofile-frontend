import React, { useState } from "react";
import axios from "axios";
import { RiskData } from "./api";
import MyAccodian from "./myAccodian";
import "../Media/accodion.css";
import Gauge from "./graph";

export default function Accodion() {
  
  const [datavalue, setdata] = useState(new Set());
  const [value, setvalue] = useState(false);
  const [selected, setSelected] = useState(false);
  const [obj, setobj] = useState({});
  const [validationMessages, setValidationMessages] = useState([]);
  const [formData, setFormData] = useState({});
  // eslint-disable-next-line
  const [count, setCount] = useState([]);
  const [gaugeShow, setGaugeShow] = useState(false);
  const [scoreVal, setScoreVal] = useState(new Set());
  const [name, setName] = useState();
  const [currentPage, setCurrPage] = useState(1);
  let nav=false;

//Calculate graph scores
  const handleScore = (i,value) => {
    if(count.length===i)
    count.push(value);
    else
    count[i]=value;
    addingScore();
  };

  const addingScore = () => {
    let sum = 0;
    for (let i = 0; i < count.length; i++) {
      sum += count[i];
    }

    if (sum === 0 && sum <= 10) {
      setScoreVal(sum);
      setName("Conservative");
    } else if (sum >= 11 && sum <= 20) {
      setScoreVal(sum);
      setName("Moderate Conservative");
    } else if (sum >= 21 && sum <= 30) {
      setScoreVal(sum);
      setName("Moderate");
    } else if (sum >= 31 && sum <= 40) {
      setScoreVal(sum);
      setName("Moderate Aggressive");
    } else {
      if (sum > 50) {
        setScoreVal(50);
        setName("Aggressive");
        return;
      }
      setScoreVal(sum);
      setName("Aggressive");
    }
  };


  //Getting Updated Values in Forms
  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  //Frontend Validation 
    const handleClick = (evt) => {
    validateForm();
    if (validationMessages.length < 0) {
      evt.preventDefault();
    }
  };

  const validateForm = () => {
    const { name, contact, email } = formData;

    setValidationMessages([]);
    let messages = [];
    let regmobile = /^[0-9]+$/;
    if (name.length < 3) {
      messages.push("Name is too short");
    } else if (name.length > 30) {
      messages.push("Name is too large");
    } else if (contact.length !== 10 || !regmobile.test(contact)) {
      messages.push("Give Valid Mobile Number");
    } else if (
      email.charAt(email.length - 4) !== "." &&
      email.charAt(email.length - 4) !== "."
    ) {
      messages.push(". is not at correct position");
    } else {
      nav=true;
    }
    setValidationMessages(messages);
  };

//Store index and their answers in object
  const set = (i, val, score) => {
    if (!datavalue.has(i)) {
      datavalue.add(i);
      setdata(datavalue);
    }
    setobj((prevState) => ({ ...prevState, [i]: val, score }));

    if (datavalue.size === RiskData.length) {
      setSelected(true);
    }
  };

  //Axios call on submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    handleClick();
    if (nav) {
    const name = event.target.name.value;
    const email = event.target.email.value;
    const mobile = event.target.contact.value;
    await axios
      .post("/api", { obj, name, email, mobile })
      .then((res) => {console.log("backend:",res.data) });
    
      setGaugeShow(true);
      setvalue(false);
    }
  };


//reload page
  const RenewRiskProfile = () => {
    setName("");
    window.location.reload();
  };


  const recordPerPage = 2;
  const lastIndex = currentPage * recordPerPage;
  const firstIndex = lastIndex - recordPerPage;
  const records = RiskData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(RiskData.length / recordPerPage);

//Get previous questions
  function getPreviousQues() {
    if (currentPage !== 1) {
      setCurrPage(currentPage - 1);
    }
  }

  //Get next questions
  function getNextQues() {
    if (currentPage !== npage) {
      setCurrPage(currentPage + 1);
    }
  }

 
  return (
    <>
      <section className={`outerContainer ${(value || gaugeShow) && "blurBackground"}`}>
        <h4 className="containerHeading">Please complete the risk profile questionnaire given below</h4>
        <MyAccodian data={records} set={set} handleScore={handleScore} currentPage={currentPage} obj={obj} />
        <button className="btn" disabled={currentPage === 1} onClick={getPreviousQues}>Prev</button>

        <button
          disabled={!selected}
          className={currentPage === npage ? 'btn proceedBtnShow' : 'proceedBtnHide'}
          onClick={() => setvalue(true)}
        >
          Proceed
        </button>
        <button className="btn nextBtn" disabled={currentPage === npage} onClick={getNextQues}>Next</button>
      </section>
      {value && (
        <div className="popupForm">
          <form action="" onSubmit={(e) => handleSubmit(e)}>
            <div>
              <label htmlFor="name">Name</label>
              <br />
              <input
                type="text"
                name="name"
                id="name"
                className="inputPopupForm"
                value={formData.name || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email </label> <br />
              <input
                type="email"
                id="email"
                name="email"
                className="inputPopupForm"
                value={formData.email || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="Mobile">Mobile</label>
              <br />
              <input
                type="tel"
                id="Mobile"
                name="contact"
                className="inputPopupForm"
                value={formData.contact || ""}
                onChange={handleChange}
                required
              />
            </div>
            <button className="formSubmitBtn" type="submit"> Submit</button> <br />
          </form>
          <div className="validationSummary">
            {validationMessages.length > 0 && <span>Validation Summary </span>}
            {validationMessages.map((vm) => (
              <li key={vm}>{vm}</li>
            ))}
          </div>
        </div>
      )}

      {gaugeShow && (
        <Gauge
          value={scoreVal}
          RenewRiskProfile={RenewRiskProfile}
          name={name}
        />
      )}
    </>
  );
}
