import React, { useEffect, useState } from "react";
import axios from "axios";
import MyAccodian from "./myAccodian";
import "../Media/scss/main.css";
import RiskGraph from "./graph";
export default function Accodion() {
  const [openPopupForm, setOpenPopupForm] = useState(false);
  const [obj, setObj] = useState({});
  const [validationMessages, setValidationMessages] = useState();
  const [formData, setFormData] = useState({});
  const [riskMeter, setRiskMeter] = useState([]);
  const [currentPage, setCurrPage] = useState(1);
  const [risk, setRisk] = useState();
  var axiosCall = false;
  const recordPerPage = 2;
  const lastIndex = currentPage * recordPerPage;
  const firstIndex = lastIndex - recordPerPage;
  const records = risk && risk.slice(firstIndex, lastIndex);
  const totalPage = Math.ceil(risk && (Object.keys(risk).length / recordPerPage));
  useEffect(() => {
    axios
      .get("/riskProfileQuestions",)
      .then((res) => {
        setRisk(res.data.result[0].questions);
      });
  }, []);
  //Getting Updated Values in Forms
  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };
  //Forntend Validation
  const validateForm = () => {
    const { name, contact, email } = formData;
    setValidationMessages();
    var messages;
    var regmobile = /^[0-9]+$/;
    switch (true) {
      case name.length < 3:
        messages="Name is too short";
        break;
      case name.length > 30:
        messages="Name is too large";
        break;
      case contact.length != 10 || !regmobile.test(contact):
        messages="Give Valid Mobile Number";
        break;
      case email.charAt(email.length - 4) != "." && email.charAt(email.length - 4) != ".":
        messages=". is not at correct position";
        break;
      default:
        axiosCall = true;
        break;
    }
    setValidationMessages(messages);
  };
  //Store index and their answers in object
  const storeObjectValue = (i, val, score) => {
    setObj((prevState) => ({ ...prevState, [i]: { val: val, score: score } }));
  };
  //Axios call on submit
  const handleSubmit = async (event) => {
    validateForm();
    event.preventDefault();
    if (axiosCall) {
      const name = event.target.name.value;
      const email = event.target.email.value;
      const mobile = event.target.contact.value;
      await axios
        .post("/insertProfileData", { obj, name, email, mobile })
        .then((res) => {
          !res.data.status &&
            axios
              .get("/getGraphData", { params: { obj: obj, name: name, email: email, mobile: mobile } })
              .then((res) => {
                if (res.data && res.data.result) {
                  riskMeter.push(true);
                  riskMeter.push(res.data.result.sum);
                  riskMeter.push(res.data.result.riskLabel);
                  setOpenPopupForm(false);
                }
              }
              );
        })
    }
  };
  return (
    <>
      <section className={`outerContainer ${(openPopupForm || riskMeter[0]) && "blurBackground"}`}>
        <h4 className="containerHeading">Please complete the risk profile questionnaire given below</h4>
        <MyAccodian
          data={records}
          storeObjectValue={storeObjectValue}
          currentPage={currentPage}
          obj={obj}
        />
        <button className="btn" disabled={currentPage == 1} onClick={() => { (currentPage != 1) && setCurrPage(currentPage - 1) }}>Prev</button>
        <button disabled={risk && risk.length != (obj && Object.keys(obj).length)} className={currentPage == totalPage ? 'btn proceedBtnShow' : 'proceedBtnHide'} onClick={() => setOpenPopupForm(true)} >
          Proceed
        </button>
        <button className="btn nextBtn" disabled={currentPage == totalPage} onClick={() => { (currentPage != totalPage) && setCurrPage(currentPage + 1) }}>Next</button>
      </section>
      {openPopupForm && (
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
            {validationMessages  && <span>Validation Summary </span>}
            {validationMessages && <li>{validationMessages}</li>}
          </div>
        </div>
      )} {
        riskMeter[0] && (
          <RiskGraph
            value={riskMeter}
          />
        )}
    </>
  );
}
