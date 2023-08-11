import React, { useState, useContext, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import AuthContext from '../Global/AuthContext';
import Accordion from "react-bootstrap/Accordion";
function BlockEmployee(props) {
  const authData = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [isChecked, setIsChecked] = useState(props.blocked);
  const [currentDate, setCurrentDate] = useState()
  const [intDetails, setIntDetails] = useState({
    "id": null,
    "result": "",
    "client": "",
    "date": "",
  });
  // console.log(props.blocked);
  const [newIntData, setNewIntData] = useState();
  const [empDetails, setEmpDetails] = useState(null);
  const handleCloseBlockedInitial = (e) => {
    setShow(false);
    setIsChecked(false);
  }
  const handleCloseBlockedFinal = (e) => {
    setShow(false);
    setIsChecked(true);
    authData.setBlockStatus(authData.blockStatus);
    // props.blocked = false
  }
  const handleUnblockApplyResult = async (e, id) => {
    e.preventDefault();
    await axios.put(`http://localhost:2538/api/empdetails/interview/updateresultbysrno/${intDetails.srNo}`, intDetails,
      {
        headers: { Authorization: authData.accessToken }
      })
    await axios.put(`http://localhost:2538/api/empdetails/updateoncondition/${intDetails.id}`, intDetails,
      {
        headers: { Authorization: authData.accessToken }
      });
    authData.setBlockStatus(-1);
    setIsChecked(false)
    setIntDetails({
      "id": null,
      "result": "",
      "client": "",
      "date": "",
    })
    // eventx.target.checked=false;
  }
  const handleApplyBlockedResult = async (e, id) => {
    await axios.post('http://localhost:2538/api/empdetails/interview/save', intDetails,
      {
        headers: { Authorization: authData.accessToken }
      })
      .then((response) => {
        axios.put(`http://localhost:2538/api/empdetails/ongoing/${response.data.id}/${response.data.srNo}`,
          {
            headers: { Authorization: authData.accessToken }
          })
      }).then(e.preventDefault()).then((res) => {
        authData.setBlockStatus(1);
        setIsChecked(true);
      }).then(handleClose())
  }
  const handleShowApply = async (e, id) => {
    console.log(intDetails);
    const { value, checked } = e.target;
    if (checked) {
      setIntDetails({ ...intDetails, id: id })
    }
    else {
      setIsChecked(true);
      await axios.get(`http://localhost:2538/api/empdetails/interview/getLastInterview/${id}`,
        {
          headers: { Authorization: authData.accessToken }
        })
        .then((response) => {
          setIntDetails(response.data);
        })
    }
    await axios.get(`http://localhost:2538/api/empdetails/get/${id}`,
      {
        headers: { Authorization: authData.accessToken }
      })
      .then((response) => {
        setEmpDetails(response.data);
      })
    await axios.get(`http://localhost:2538/api/empdetails/interview/get/${id}`,
      {
        headers: { Authorization: authData.accessToken }
      })
      .then((response) => {
        setNewIntData(response.data);
      })
  }
  // console.log("INTDETAILS"+JSON.stringify(intDetails));
  // console.log("Last Interview"+JSON.stringify(lastInterview));
  const handleChangeValue = (e) => {
    setIntDetails({ ...intDetails, [e.target.name]: e.target.value });
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const todayDate = () => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    if (today.getDate() % 10 == today.getDate() && today.getMonth() + 1 % 10 == today.getMonth() + 1) {
      date = today.getFullYear() + '-0' + (today.getMonth() + 1) + '-0' + today.getDate();
      console.log("Date" + date);
    }
    else if (today.getDate() % 10 == today.getDate()) {
      date = today.getFullYear() + (today.getMonth() + 1) + '-0' + today.getDate();
      console.log("Date" + date);
    }
    else if (today.getMonth() + 1 % 10 == today.getMonth() + 1) {
      date = today.getFullYear() + '-0' + (today.getMonth() + 1) + '-' + today.getDate();
      console.log("Date" + date);
    }
    setCurrentDate(date);
  }
  const blockValidation = () => {
    // console.log(intDetails['date'], intDetails['client']);
    if ( intDetails && intDetails["date"].length === 0) return true;
    else if ( intDetails && intDetails["client"].length === 0) return true;
    return false;
  }
  const unblockValidation = () => {
    // console.log(intDetails['result']);
    if ( intDetails && intDetails["result"].length === 0) return true;
    return false;
  }
  return (
    <>
        <Form name="BlockEmployeeCheckBox">
            <div key='inline-checkbox' className="mb-3">
              <Form.Check
                readOnly
                inline
                label=""
                name="group1"
                type='checkbox'
                checked={isChecked}
                id='inline-checkbox-1'
                onClick={(e) => {handleShowApply(e, props.id); handleShow(); todayDate();}}
              />
            </div>
        </Form>
      {(isChecked) ?
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Interview Status - {props.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form id="block">
              <Form.Group>
                <p><b>Client Name</b>: {intDetails.client}</p>
                <p><b>Date</b> : {intDetails.date}</p>
                <Form.Label>Interview Result</Form.Label>
                <Form.Select aria-label="Default select example" name="result" onChange={handleChangeValue.bind(this)} >
                  <option>Select from below</option>
                  <option value="Rejected" >Rejected</option>
                  <option value="Accepted" >Accepted</option>
                  <option value="Awaited" >Awaited</option>
                </Form.Select>
              </Form.Group><br />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <button className="button3" variant="secondary" onClick={handleCloseBlockedFinal}>
              Close
            </button>
            <button form="block" className="button3" variant="primary"
              disabled={unblockValidation() ? true : false}
              style={unblockValidation() ? { backgroundColor: 'grey' } : {}}
              onClick={(e) => { handleUnblockApplyResult(e, props.id); handleClose(); }}>Apply</button>
          </Modal.Footer>
        </Modal>
        :
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Block - {props.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form id="block">
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Project Name</Form.Label>
                <Form.Control type="text" name="client" onChange={handleChangeValue.bind(this)} placeholder="Enter Client Name" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>From Date</Form.Label>
                <Form.Control type="date" min={currentDate} placeholder="" name="date" onChange={handleChangeValue.bind(this)} />
              </Form.Group>
            </Form>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header><div className="pfilter">Previous Interview Details</div></Accordion.Header>
                <Accordion.Body>
                  <table className="table">
                    <thead className="thread1">
                      <tr className="tableHeader">
                        <th className="table-align-left" scope="col">
                          Client Name
                        </th>
                        <th className="table-align-left" scope="col">
                          Date
                        </th>
                        <th className="table-align-left" scope="col">
                          Result
                        </th>
                      </tr>
                    </thead>
                    <tbody className="thread1">
                      {newIntData
                        &&
                        newIntData.map((emp) =>
                          <tr>
                            <td
                              className="table-align-left" scope="row" >
                              {emp.client}
                            </td>
                            <td className="table-align-left">
                              {emp.date}
                            </td>
                            <td className="table-align-left">
                              {emp.result == true ? "Accepted" : "Rejected"}
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Modal.Body>
          <Modal.Footer>
            <button className="button3" variant="secondary" onClick={handleCloseBlockedInitial}>
              Close
            </button>
            <button form="block" className="button3" variant="primary"
              disabled={blockValidation() ? true : false}
              style={blockValidation() ? { backgroundColor: 'grey' } : {}}
              onClick={(e) => handleApplyBlockedResult(e, props.id)}>Apply</button>
          </Modal.Footer>
        </Modal>}
    </>
  );
}
export default BlockEmployee;