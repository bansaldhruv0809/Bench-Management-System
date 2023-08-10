import React, { useState, useContext, useEffect } from "react";
import '../../../Assets/Styles/Project.css';
import AuthContext from '../../Global/AuthContext.js';
import Accordion from "react-bootstrap/Accordion";
import axios from "axios";


export default function SideBar() {
  const authData = useContext(AuthContext);
  const [BUList, setBUList] = useState([]);
  const [LocationList, setLocationList] = useState([]);
  const [SkillList, setSkillList] = useState([]);

  const fetchApis = async () => {
    // let itemList=[];
    try {
      const list1 = await axios
        .get("http://localhost:2538/api/empdetails/get/BU",{
          headers : {Authorization : authData.accessToken}
        })
        .then((res) => {
          setBUList(res.data);
        });
      const List2 = await axios
        .get("http://localhost:2538/api/empdetails/get/Location",{
          headers : {Authorization : authData.accessToken}
        })
        .then((res) => {
          let tempData=[];
          res.data.forEach(element => {                
               tempData.push(element);
          })
          setLocationList(tempData);
        });

      const List3 = await axios
        .get("http://localhost:2538/api/skill/get/skill",{
          headers : {Authorization : authData.accessToken}
        })
        .then((res) => {
          setSkillList(res.data);
        });
    } catch {
      console.log();
    }
  };

  useEffect(() => {
    fetchApis();
  }, []);

  //Handle BU filters

  const handleBUFilter = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      authData.setCheckFilter({
        ...authData.checkFilter,
        ["BU"]: authData.checkFilter["BU"] + 1,
      });
      //set BU unit
      let buTempSet=new Set(authData.buSet)
      buTempSet.add(e.target.name)
      authData.setBuSet(buTempSet)
    } else {
      authData.setCheckFilter({
        ...authData.checkFilter,
        ["BU"]: authData.checkFilter["BU"] - 1,
      });
      authData.buSet.delete(e.target.name)
    }
  };


  // const [newSet,setNewSet]=useState(new Set([]));
  //Handle Location filters
  const handleLocationFilter = (e) => {
    const { value, checked } = e.target;
    if (checked) {    
      let locationTempSet=new Set(authData.Locations)
      locationTempSet.add(e.target.name)
      authData.setLocations(locationTempSet)
      authData.setCheckFilter({
        ...authData.checkFilter,
        ["location"]: authData.checkFilter["location"] + 1,
      });
      ///----
      // authData.setLocations(prv => new Set([...prv, e.target.name]));
      //----
    }
    else {
      authData.setCheckFilter({
        ...authData.checkFilter,
        ["location"]: authData.checkFilter["location"] - 1,
      });
      authData.Locations.delete(e.target.name)
    }
  };
  //Handle Skills Filters
  const handleSkillsFilter = (e) => {
    const { value, checked } = e.target;
    let True = true,
      False = false;
    if (checked) {
      authData.setReqDto({
        ...authData.requestDto,
        [e.target.name]: True,
      });
      authData.setCheckFilter({
        ...authData.checkFilter,
        ["skill"]: authData.checkFilter["skill"] + 1,
      });
      let skillsTempSet=new Set(authData.skillsSet)
      skillsTempSet.add(e.target.name)
      authData.setSkillsSet(skillsTempSet)
    }
    else {
      authData.setReqDto({
        ...authData.requestDto,
        [e.target.name]: False,
      });
      authData.setCheckFilter({
        ...authData.checkFilter,
        ["skill"]: authData.checkFilter["skill"] - 1,
      });
      authData.skillsSet.delete(e.target.name)
    }
  };
  //Handle State Filters
  const handleStateFilters = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      if (e.target.name === "notblocked" || e.target.name === "blocked") {
        authData.setCheckFilter({
          ...authData.checkFilter,
          ["status"]: authData.checkFilter["status"] + 1,
        });
    }
    let statusTempSet=new Set(authData.statusSet)
        statusTempSet.add(e.target.name)
        authData.setStatusSet(statusTempSet)

    }
    else {
      if (e.target.name === "notblocked" || e.target.name === "blocked") {
        authData.setCheckFilter({
          ...authData.checkFilter,
          ["status"]: authData.checkFilter["status"] - 1,
        });
       
      }
      authData.statusSet.delete(e.target.name)
    }
  };

  return (
    <>
      <div className="filterHeading">
        <p className="pfilterHeading">SORT BY FILTERS</p>
      </div>
      <div className="left-panel">
        <div className="filterContainer">
          <div className="filterByExperience">
            <p className="pfilter">
              EXPERIENCE{" "}
              <span className="span-style">
                ( {authData.requestDto.experience}+ Years)
              </span>
            </p>
            <label htmlFor="customRange2" className="form-label"></label>
            <input
              type="range"
              className="form-range experienceClass"
              min="1"
              max="11"
              onChange={(e) => {
                // authData.setExperienceValue(e.target.value);
                authData.setReqDto({
                  ...authData.requestDto,
                  ["experience"]: e.target.value - 1,
                });
              }}
              id="customRange2"
              value={authData.requestDto.experience}
            />
            <p className="sliderParaLeft">0 Years</p>
            <span className="sliderParaRightExpereince">10 Years</span>
          </div>

          <div className="filterByBenchTime">
            <p className="pfilter">
              BENCH AGING{" "}
              <span className="span-style">
                ( {authData.requestDto.benchPeriod} + Months)
              </span>
            </p>
            <label htmlFor="customRange2" className="form-label"></label>
            <input
              type="range"
              className="form-range benchTimeSliderClass"
              min="1"
              max="13"
              onChange={(e) => {
                // authData.setBenchTimeValue(e.target.value);
                authData.setReqDto({
                  ...authData.requestDto,
                  ["benchPeriod"]: e.target.value - 1,
                });
              }}
              id="customRange2"
              value={authData.requestDto.benchPeriod}
            />
            <p className="sliderParaLeft">0 Months</p>
            <span className="sliderParaRightBench">12 Months</span>
          </div>

          <div className="accordian">
            <Accordion eventKey={["0"]} alwaysOpen>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <div className="pfilter">BUSINESS UNIT</div>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="filterByBusinessUnit">
                    {BUList.map((item, index) => (
                      <div className="form-check" key={index}>
                        
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name={item}
                          id={index}
                          value={true}
                          defaultChecked={Array.from(authData.buSet).includes(item)}
                          onChange={handleBUFilter.bind(this)}
                        />
                        <label className="form-check-label labelFont" htmlFor={index}>
                          {item = item.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                      </div>
                    ))}
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  <div className="pfilter">LOCATION</div>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="filterByBusinessUnit">
                    {LocationList.map((item, ind) => (
                      authData.locationAcess[item] && 
                      <div className="form-check" key={ind}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name={item}
                          id={item}
                          value={true}
                          defaultChecked={Array.from(authData.Locations).includes(item)}
                          onChange={handleLocationFilter.bind(this)}
                        />
                        <label className="form-check-label labelFont" htmlFor={item}>
                          {item.charAt(0).toUpperCase()+item.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  <div className="pfilter">SKILLS</div>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="filterBySkills">
                    {SkillList.map((item, index) => (
                      <div className="form-check" key={index}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name={item}
                          id={item}
                          value={true}
                          defaultChecked={Array.from(authData.skillsSet).includes(item)}
                          onChange={handleSkillsFilter.bind(this)}
                        />
                        <label className="form-check-label labelFont" htmlFor={item}>
                          {item.charAt(0).toUpperCase()+item.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="3">
                <Accordion.Header>
                  <div className="pfilter">STATUS</div>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="filterByStatus">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="notblocked"
                      value={true}
                      onChange={handleStateFilters.bind(this)}
                      id="status-1"
                      defaultChecked={Array.from(authData.statusSet).includes("notblocked")}
                    />
                    <label
                      className="form-check-label labelFont"
                      htmlFor="status-1"
                    >
                      Not Blocked
                    </label>
                    <br />
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="blocked"
                      value={true}
                      onChange={handleStateFilters.bind(this)}
                      id="status-2"
                      checked={Array.from(authData.statusSet).includes("blocked")}
                    />
                    <label
                      className="form-check-label labelFont"
                      htmlFor="status-2"
                    >
                      Blocked
                    </label>
                    <br />
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <br />
          </div>
        </div>
      </div>
    </>
  );
}
