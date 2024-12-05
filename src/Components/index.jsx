import React, { useEffect, useState } from "react"
import axios from "axios"
import MyAccodian from "./myAccodian"
import "../Media/scss/main.css"
import RiskGraph from "./graph"
export default function Accodion() {
  const [openPopupForm, setOpenPopupForm] = useState(false)
  const [obj, setObj] = useState({})
  const [validationMessages, setValidationMessages] = useState()
  const [formData, setFormData] = useState({})
  const [riskMeter, setRiskMeter] = useState({ status: -1 })
  const [currentPage, setCurrPage] = useState(1)
  const [risk, setRisk] = useState()
  let axiosCall = false
  const recordPerPage = 2
  const lastIndex = currentPage * recordPerPage
  const firstIndex = lastIndex - recordPerPage
  const records = risk && risk.slice(firstIndex, lastIndex)
  const totalPage = Math.ceil(risk && (Object.keys(risk).length / recordPerPage))
  useEffect(() => {
    axios
      .get("/getRiskProfileQuestions",)
      .then((res) => {
        setRisk(res.data.result[0].questions)
      })
  }, [])
  //Getting Updated Values in Forms
  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value })
  }
  //Forntend Validation
  const validateForm = () => {
    const { name, contact, email } = formData
    let messages
    const regmobile = /^[0-9]+$/
    const regemail = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+(?:com|co|in)$/
    switch (true) {
      case name.length < 3:
        messages = "Name is too short"
        break
      case name.length > 30:
        messages = "Name is too large"
        break
      case !regemail.test(email):
        messages = "Give a valid email"
        break
      case contact.length != 10 || !regmobile.test(contact):
        messages = "Give Valid Mobile Number"
        break
      default:
        axiosCall = true
        break
    }
    setValidationMessages(messages)
  }
  //Store index and their answers in object
  const storeObjectValue = (i, val, score) => {
    setObj((prevState) => ({ ...prevState, [i]: { val, score } }))
  }
  //Axios call on submit
  const handleSubmit = (event) => {
    validateForm()
    event.preventDefault()
    if (axiosCall) {
      const name = event.target.name.value
      const email = event.target.email.value
      const mobile = event.target.contact.value
      axios
        .post("/insertProfileData", { obj, name, email, mobile })
        .then((res) => {
          !res.data.status &&
            axios
              .get("/getGraphData", { params: { obj, name, email, mobile } })
              .then((res) => {
                if (res.data && res.data.result) {
                  setRiskMeter(res.data)
                  setOpenPopupForm(false)
                }
              }
              )
        })
    }
  }
  return (
    <>
      <section className={`outerContainer ${(openPopupForm) && "blurBackground"} ${!riskMeter.status && "blurRiskGraphBackgroundGraph"}`}>
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
            {validationMessages && <span>Validation Summary </span>}
            {validationMessages && <li>{validationMessages}</li>}
          </div>
        </div>
      )} {
        !riskMeter.status &&  (
          <RiskGraph
            value={riskMeter}
          />
        )}
    </>
  )
}
