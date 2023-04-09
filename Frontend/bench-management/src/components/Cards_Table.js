import React from 'react'
import SideBar from './Side_Bar'

export default function Cards_Table() {

  document.body.backGroundColor = "rgb(8, 8, 41)";

  return (
    <>
      <div className='cardsTableMain'>
        <SideBar />
        <div style={{ height: "100vh", borderRight: "0.1px inset black" }}></div>
        <div className='cards-table'>
          <div className='search'>
            <nav className="navbar"  style={{justifyContent:'flex-end'}}>
              <div className="container-fluid">
                <form className="d-flex" role="search">
                  <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                  <button className="btn btn-outline-warning" type="submit">Search</button>
                </form>
              </div>
            </nav>
          </div>
          <hr style={{color:'white', marginBottom:'0px'}}/>
          <div className='cards-heading'>
          <h5>STATISTICS</h5>
        </div>

          <div className='cards my-2'>
            <div className="row mx-3">
              <div className="col-sm-3 mb-3 my-3 mx-5">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Total Employees</h5>
                    <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>

                  </div>
                </div>
              </div>
              <div className="col-sm-3 my-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Active Employees</h5>
                    <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>

                  </div>
                </div>
              </div>
              <div className="col-sm-3 mx-5 my-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Benched Employees</h5>
                    <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>

                  </div>
                </div>
              </div>
            </div>
          </div>

          <h5>EMPLOYEES</h5>

          <div className='table-subheading'>
            <h6>All</h6>
            <h6>Active</h6>
            <h6>Benched</h6>
          </div>
          {/* <div className='table-format'>
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th scope="col">Emp_Id</th>
                <th scope="col">Emp_Name</th>
                <th scope="col">Location</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Dhruv Bansal</td>
                <td>Gurugram</td>
                <td>Active</td>
                <td>View/Update</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Megha Mathur</td>
                <td>Gurugram</td>
                <td>Active</td>
                <td>View/Update</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Shambhavi Vats</td>
                <td>Gurugram</td>
                <td>Active</td>
                <td>View/Update</td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Gobind</td>
                <td>Gurugram</td>
                <td>Active</td>
                <td>View/Update</td>
              </tr>
              <tr>
                <th scope="row">6</th>
                <td>Dhruv Bansal</td>
                <td>Gurugram</td>
                <td>Active</td>
                <td>View/Update</td>
              </tr>
            </tbody>
          </table>
        </div> */}
        </div>
      </div>
    </>

  )
}
