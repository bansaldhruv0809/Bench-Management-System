import React, { useState, useEffect, useContext, useRef } from "react";
import '../../../../Assets/Styles/Project.css';
import Navbar from '../Navbar.js';
import SideBar from '../SideBar.js';
import axios from "axios";
import UpdateEmployee from '../../../Features/UpdateEmployee.js';
import { useNavigate } from "react-router-dom";
import AuthContext from '../../../Global/AuthContext.js';
import UploadFile from '../../../Features/UploadFile.js';
import DownloadFile from '../../../Features/DownloadFile.js';
import BlockEmployee from '../../../Features/BlockEmployee.js';
import Login from "../../Home/Login";

export default function AdminDashboard() {
  const authData = useContext(AuthContext);
  const navigate = useNavigate();
  const handleViewEmployee = () => {
    authData.setShowSearchBar(false);
    navigate("/viewEmployee");
  };

  const handleUnauthorized = () => {
    navigate("/");
    return (
      <Login/>
    )
  }

  //--------------------------------------

  const handleReport = async () => {
    authData.setShowSearchBar(false);
    navigate('/viewReport');
  }

  const [refreshData, setRefresh] = useState(false)
  function handleRefresh() {
    authData.setNewData([]);
    setRefresh(!refreshData);
  }

  const fetchApis = async () => {
    authData.setShowSearchBar(true)
    try {
      //get all filtered data 
      await axios.post(
        "http://localhost:2538/api/dto/get/filterd", authData.requestDto,{
          headers : {Authorization : authData.accessToken}
        }
      ).then((res) => {
        authData.setNewData(res.data);
      });

    }
    catch {
      console.log();
    }
  }
  useEffect(() => {
    console.log('inside useEffect');
    const timeout = setTimeout(() => fetchApis(), 200)
    authData.setBlockStatus(0);
    return () => clearTimeout(timeout);
  }, [authData.file, authData.requestDto, authData.blockStatus, refreshData]);

  const fetchCountApi = async () => {
    try {
      //get manager Not Assigned Location
      await axios.get(`http://localhost:2538/api/manager/get/notassignedLocation/${authData.managerId}`,{
        headers : {Authorization : authData.accessToken}
      }).
        then((res) => {
          //by default location
          authData.locationAcess.Gurugram = true;
          authData.locationAcess.Bangalore = true;
          authData.locationAcess.Hyderabad = true;
          res.data.map((element) => {
            if (element == 1) {
              authData.locationAcess.Gurugram = false;
            }
            else if (element == 2) {
              authData.locationAcess.Bangalore = false;
            }
            else if (element == 3) {
              authData.locationAcess.Hyderabad = false;
            }
          })
        })
      //count emp locatin wise 
      const countOfEachLoc = await axios.get(
        "http://localhost:2538/api/empdetails/get/countOfEachLocation",{
          headers : {Authorization : authData.accessToken}
        }
      ).then((res) => {
        let tempData = [];
        res.data.forEach(element => {
          // console.log(element.count)              
          tempData.push(parseInt(element.count));
        });

        //set pie chart labels
        let pieChartLabels = []
        //remove bad indexes
        let one = 1, two = 1, three = 1;
        if (authData.locationAcess["Gurugram"]) { pieChartLabels.push("Gurugram"); one = 0; }
        if (authData.locationAcess["Bangalore"]) { two = 0; pieChartLabels.push("Bangalore"); }
        if (authData.locationAcess["Hyderabad"]) { three = 0; pieChartLabels.push("Hyderabad") }
        authData.setPieChartLables(pieChartLabels);
        if (one) tempData[0] = 0;
        if (two) tempData[1] = 0;
        if (three) tempData[2] = 0;
        authData.setCountOfEachLocation(tempData);
      })
    }
    catch { }
  }
  
  useEffect(() => {
    fetchCountApi();
  }, [])

  // console.log("manager ID " + authData.managerId)
  const allowData = (emp) => {

    //----------Check for BU-----------------------------//
    let okBU = false;
    let buData = Array.from(authData.buSet);
    okBU = buData.includes(emp.businessUnit);
    //------------check for the location--------------------------//
    let okLocation = false;
    let locationData = Array.from(authData.Locations);
    okLocation = locationData.includes(emp.location);

    //------Check for Blocked status ----////
    let okStatus = false;
    if (emp.blocked == true) { okStatus = Array.from(authData.statusSet).includes("blocked"); }
    else { okStatus = Array.from(authData.statusSet).includes("notblocked"); }

    // return okStatus;
    if (
      authData.checkFilter["location"] &&
      authData.checkFilter["status"] && authData.checkFilter["BU"]
    )
      return okStatus && okLocation && okBU;
    else if (authData.checkFilter["location"] && authData.checkFilter["status"])
      return okLocation && okStatus;
    else if (authData.checkFilter["location"] && authData.checkFilter["BU"])
      return okLocation && okBU;
    else if (authData.checkFilter["status"] && authData.checkFilter["BU"])
      return okBU && okStatus;
    else if (authData.checkFilter["status"]) return okStatus;
    else if (authData.checkFilter["BU"]) return okBU;
    else if (authData.checkFilter["location"]) return okLocation;
    else return true;
  };
  const checkAssignedLocation = (emp) => {
    if (emp.location == "Gurugram" && authData.locationAcess["Gurugram"]) return true;
    else if (emp.location == "Bangalore" && authData.locationAcess["Bangalore"]) return true;
    else if (emp.location == "Hyderabad" && authData.locationAcess["Hyderabad"]) return true;
    return false;
  }
  const [file, setFile] = useState([]);
  const inputFile = useRef(null);

  const handleChange = e => {
    setFile([...file, e.target.files[0]]);

  }

  const getColor = (color) => {
    if (color) return 'red';
    return '';
  };
  // console.log("new data " + JSON.stringify(authData.newData))

  //Sorting
  const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = React.useState(config);
    // console.log("aaaaaaaaaaaa"+JSON.stringify(items));
    const sortedItems = React.useMemo(() => {
      let sortableItems = items; 
      if (sortConfig !== null) {
        sortableItems.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        });
      }
      return sortableItems;
    }, [items, sortConfig]);
    const requestSort = key => {
      let direction = 'ascending';
      if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
      }
      setSortConfig({ key, direction });
    }
    return { items: sortedItems, requestSort, sortConfig };
  };
  //-----------------------------------------
  const { items, requestSort, sortConfig } = useSortableData(authData.newData);
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  //-----------------------------------------

  return (
    authData.isAuthentication === true && authData.otpVerify === true?
    <div className="window">
      <div className="top">
        <Navbar />
      </div>
      <div className="bottom">
        <div className="bottom-left">
          <SideBar />
        </div>
        <div className="bottom-right">
          <div className="actions-manager">
            <p className="employees">EMPLOYEES</p>
            <div className='buttons'>
              <button className="button2" onClick={handleReport}>
                <i className="fa-solid fa-chart-simple"></i> &nbsp;
                VIEW REPORT
              </button>
              <button className="reload" onClick={handleRefresh} >
                <i className="fa-solid fa-rotate-right fa-lg"></i>
              </button>
            </div>
          </div>
          <div className="table">
            <div className="table-format">
              <table className="table">
                <thead className="thread1">
                  <tr className="tableHeader">
                    <th className="table-align-left" scope="col">
                      Block
                    </th>
                    <th className="table-align-left" scope="col">
                      <button className={getClassNamesFor('employeeName')} type="button" onClick={() => requestSort('employeeName')}>
                        Name
                      </button>
                    </th>
                    <th className="table-align-left" scope="col">
                      Email
                    </th>
                    <th className="table-align-left" scope="col">
                      <button className={getClassNamesFor('location')} type="button" onClick={() => requestSort('location')}>
                        Location
                      </button>
                    </th>
                    <th className="table-align-left" scope="col">
                      <button className={getClassNamesFor('benchPeriod')} type="button" onClick={() => requestSort('benchPeriod')}>
                        Bench_Aging
                      </button>

                    </th>
                    <th className="table-align-left" scope="col">
                      Resume
                    </th>
                    <th className="table-align-left" scope="col">
                      Remove
                    </th>
                  </tr>
                </thead>
                <tbody className="thread1">
                  {
                  authData.newData &&
                    authData.newData.map((emp, key = emp.employeeId) =>
                      allowData(emp) == true && checkAssignedLocation(emp) &&
                        ((authData.searchValue == "" ||
                          emp.employeeName
                            .toLowerCase()
                            .includes(authData.searchValue)) && emp.benchStatus == true) ? (
                        <tr style={{ color: getColor(emp.blocked) }}>
                          {/* <th className='pointer-to-profile' title="Click on ID to view profile" scope="row" onClick={() => { handleViewEmployee(); authData.handleEmpId(emp.employeeId); }} >{emp.employeeId}</th> */}
                          <th className="table-align-left">
                            <BlockEmployee id={emp.employeeId} blocked={emp.blocked} name={emp.employeeName} key = {emp.employeeId} />
                          </th>
                          <td
                            className="pointer-to-profile textFontTable" title="Click on ID to view profile" scope="row" onClick={() => { handleViewEmployee(); authData.handleEmpId(emp.employeeId); }}>
                            {emp.employeeName}
                          </td>
                          <td className="table-align-left textFontTable">
                            {emp.email}
                          </td>
                          <td className="table-align-left textFontTable">
                            {emp.location}
                          </td>
                          <td className="table-align-left textFontTable">
                            {emp.benchStatus == 0
                              ? "Removed From Bench"
                              : `${Math.round(emp.benchPeriod * 0.032855)} Months, ${emp.benchPeriod % 30} Days`}
                          </td>
                          {/* <td className="table-align-left"><UpdateEmployee id = {emp.employeeId}/></td> */}
                          <td className="table-align-left">
                            <UploadFile id={emp.employeeId} resume={emp.resume} />&nbsp;&nbsp;
                            <DownloadFile id={emp.employeeId} name={emp.employeeName} />
                          </td>

                          <td className="table-align-left-action">
                            <UpdateEmployee id={emp.employeeId} name={emp.employeeName} />
                            {/* {" "} */}
                            &nbsp; &nbsp;
                          </td>
                        </tr>
                      )
                        : (
                          <tr></tr>
                        )
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    :
    handleUnauthorized()
  );
}
