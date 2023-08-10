import React, { useState, useEffect, useContext, useRef } from "react";
import "../../../../Assets/Styles/Project.css";
import Navbar from "../Navbar.js";
import SideBar from "../SideBar.js";
import ViewManager from "./ViewManager.js";
import axios from "axios";
import UpdateEmployee from "../../../Features/UpdateEmployee.js";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../Global/AuthContext.js";
import UploadFile from "../../../Features/UploadFile.js";
import DownloadFile from "../../../Features/DownloadFile.js";
import BlockEmployee from "../../../Features/BlockEmployee.js";
import Login from "../../Home/Login";

export default function AdminDashboard() {
  const authData = useContext(AuthContext);
  const navigate = useNavigate();

  const handleViewEmployee = () => {
    authData.setShowSearchBar(false);
    navigate("/viewEmployee");
  };

  const handleReport = () => {
    authData.setShowSearchBar(false);
    navigate("/viewReport");
  };

  const handleUnauthorized = () => {
    navigate("/");
    return (
      <Login />
    )
  }

  const [refreshData, setRefresh] = useState(false)
  function handleRefresh() {
    authData.setNewData([]);
    setRefresh(!refreshData);
  }

  const fetchApis = async () => {
    authData.setShowSearchBar(true)
    try {
      await axios.post(
        "http://localhost:2538/api/dto/get/filterd", authData.requestDto, {
        headers: { Authorization: authData.accessToken }
      }).then((res) => {
        authData.setNewData(res.data);
      });
    }
    catch { }
  };
  // console.log("refresh " + refreshData)
  useEffect(() => {
    const timeout = setTimeout(() => fetchApis(), 200)
    authData.setBlockStatus(0);
    return () => clearTimeout(timeout);
  }, [authData.requestDto, authData.file, authData.blockStatus, refreshData]);

  const fetchCountApis = async () => {
    try {
      //count emp locatin wise 
      await axios.get(
        "http://localhost:2538/api/empdetails/get/countOfEachLocation", {
        headers: { Authorization: authData.accessToken }
      }).then((res) => {
        let tempData = [];
        res.data.forEach(element => {
          tempData.push(parseInt(element.count));
        });
        authData.setCountOfEachLocation(tempData);
      })
    }
    catch { }
  }

  useEffect(() => {
    fetchCountApis();
  }, [])

  const allowData = (emp,key) => {
    // console.log("emp "+JSON.stringify(emp))
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
    if (emp.blocked == true) {
      okStatus = Array.from(authData.statusSet).includes("blocked");
    } else {
      okStatus = Array.from(authData.statusSet).includes("notblocked");
    }
    if (
      authData.checkFilter["location"] &&
      authData.checkFilter["status"] &&
      authData.checkFilter["BU"]
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

  const [file, setFile] = useState([]);
  // const inputFile = useRef(null);
  const handleChange = (e) => {
    setFile([...file, e.target.files[0]]);
  };
  //--------------------------------
  const getColor = (color) => {
    if (color) return "red";
    return "";
  };
  //--------------------------------
  // console.log("new data "+JSON.stringify(authData.newData))
  // console.log("req dto "+JSON.stringify(authData.requestDto))
  // console.log("Checked Filters "+JSON.stringify(authData.checkFilter))
  // console.log("Locationssss "+JSON.stringify(authData.Locations))
  // console.log("LocationSet "+Array.from(authData.Locations));
  // console.log("BUSet "+Array.from(authData.buSet));
  // console.log("StatusSet "+Array.from(authData.statusSet));
  // console.log("req dto "+JSON.stringify(authData.requestDto))
  // console.log("block status " + authData.blockStatus)

  //--------------------------------
  //Sorting
  const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = React.useState(config);
    // console.log("aaaaaaaaaaaa"+JSON.stringify(items));
    const sortedItems = React.useMemo(() => {
      let sortableItems = items;
      if (sortConfig !== null) {
        sortableItems.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        });
      }
      return sortableItems;
    }, [items, sortConfig]);
    const requestSort = (key) => {
      let direction = "ascending";
      if (
        sortConfig &&
        sortConfig.key === key &&
        sortConfig.direction === "ascending"
      ) {
        direction = "descending";
      }
      setSortConfig({ key, direction });
    };
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
    authData.isAuthentication === true && authData.otpVerify === true ?
      (
        <>
          <div className="window">
            <div className="top">
              <Navbar />
            </div>
            <div className="bottom">
              <div className="bottom-left">
                <SideBar />
              </div>
              <div className="bottom-right">
                <div className="actions-admin">
                  <p className="employees">EMPLOYEES</p>
                  <div className="buttons">
                    <ViewManager />
                    <button className="button2" onClick={handleReport}>
                      <i className="fa-solid fa-chart-simple"></i> &nbsp; VIEW REPORT
                    </button>
                    <button className="reload" type="button" onClick={handleRefresh}>
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
                            <button
                              className={getClassNamesFor("employeeName")}
                              type="button"
                              onClick={() => requestSort("employeeName")}
                            >
                              Name
                            </button>
                          </th>
                          <th className="table-align-left" scope="col">
                            Email
                          </th>
                          <th className="table-align-left" scope="col">
                            <button
                              className={getClassNamesFor("location")}
                              type="button"
                              onClick={() => requestSort("location")}
                            >
                              Location
                            </button>
                          </th>
                          <th className="table-align-left" scope="col">
                            <button
                              className={getClassNamesFor("benchPeriod")}
                              type="button"
                              onClick={() => requestSort("benchPeriod")}
                            >
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
                        {authData.newData &&
                          authData.newData.map((emp, key=emp.employeeId) =>
                            allowData(emp,key) == true &&
                              (authData.searchValue == "" ||
                                emp.employeeName
                                  .toLowerCase()
                                  .includes(authData.searchValue)) &&
                              emp.benchStatus == true ? (
                              <tr style={{ color: getColor(emp.blocked) }}>
                                <th className="table-align-left">
                                  <BlockEmployee
                                    id={emp.employeeId}
                                    blocked={emp.blocked}
                                    name={emp.employeeName}
                                  />
                                </th>
                                <td
                                  className="pointer-to-profile"
                                  title="View profile"
                                  scope="row"
                                  onClick={() => {
                                    handleViewEmployee();
                                    authData.handleEmpId(emp.employeeId);
                                  }}
                                >
                                  {emp.employeeName}
                                </td>
                                <td className="table-align-left">{emp.email}</td>
                                <td className="table-align-left">{emp.location}</td>
                                <td className="table-align-left">
                                  {emp.benchStatus == 0
                                    ? "Removed From Bench"
                                    : `${Math.round(
                                      emp.benchPeriod * 0.032855
                                    )} Months, ${emp.benchPeriod % 30} Days`}
                                </td>
                                <td className="table-align-left">
                                  <UploadFile
                                    id={emp.employeeId}
                                    resume={emp.resume}
                                  />
                                  &nbsp;&nbsp;
                                  <DownloadFile
                                    id={emp.employeeId}
                                    name={emp.employeeName}
                                  />
                                </td>

                                <td className="table-align-left-action">
                                  <UpdateEmployee
                                    id={emp.employeeId}
                                    name={emp.employeeName}
                                  />
                                  &nbsp; &nbsp;
                                </td>
                              </tr>
                            ) : (
                              null
                            )
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )
      : (
        handleUnauthorized()
      )
  );
}
