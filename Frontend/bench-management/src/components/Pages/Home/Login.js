import React, { useContext, useState, useEffect } from 'react';
import '../../../Assets/Styles/Project.css';
import axios, { AxiosHeaders } from 'axios';
import logoImage from '../../../Assets/Images/accoliteLogo.png';
import jwt_decode from "jwt-decode";
import AuthContext from '../../Global/AuthContext.js';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const authData = useContext(AuthContext);
  const google = window.google;
  const { REACT_APP_GOOGLE_CLIENT_ID, REACT_APP_URL } = process.env;
  const navigate = useNavigate();
  
  function handleNotVerfied() {
    alert("Sorry you are not authorized to access!!");
  }

  useEffect(() => {
    (
      authData.mfaEnabled === "0" ? (
        navigate("/setup2fa", {replace:true})
      )
        : (
          authData.otpVerify === false ? (
            navigate("/verify2fa", {replace:true})
          )
            : (
              authData.currentRole === "admin" ? (
                navigate("/admin", {replace:true})
              )
                : navigate("/manager", {replace:true})
            )
        )
    )
  },[authData.isAuthentication]);

  function handleCallbackResponse(response) {
    // console.log(response.credential); jwt
    var userObject = jwt_decode(response.credential);
    authData.setGoogleData(userObject);

    axios.post(`${REACT_APP_URL}/login/verify`, response.credential, {
      headers: { 'Content-Type': 'text/plain' }
    })
      .then((res) => {
        // console.log(res.data);
        if (res.data === "not verified") handleNotVerfied();
        else {
          let data = res.data;
          authData.setAccessToken(data.substring(data.indexOf('+ ') + 2, data.length - 2));
          authData.setCurrentRole(data.substring(0, data.indexOf(' ')));
          authData.setMfaEnabled(data[data.length - 1]);
          if (authData.currentRole != "admin") {
            authData.setManagerId(data.substring(0, data.indexOf(' ')));
          }
          authData.handleLogin();
        }
      });
  }
  
  useEffect(() => {
    google?.accounts.id.initialize({
      client_id: `${REACT_APP_GOOGLE_CLIENT_ID}`, // add client id in .env file
      ux_mode: "popup",
      callback: handleCallbackResponse
    });
  },[]);
    
  useEffect(() => {
    google?.accounts.id.renderButton(
      document.getElementById("loginButton"),
      { theme: "outline", size: "large", shape: "pill", width: "350px" }
    );
    google?.accounts.id.prompt();
  }, []);

  return (
    authData.isAuthentication === false ?
      (
        <div className='loginContainer'>
          <div>
            <img className='logoContainer' src={logoImage} alt="accoliteLogo" />
          </div>
          <div className='loginPageContent'>
            <h5 className='welcomeHeading'>Welcome To</h5>
            <h1 className='projectHeading'>Bench Management System</h1>
            <b>
              <hr className="hr-text" data-content="One Tap Below to Sign-in" />
            </b>
            <div id="loginButton"></div>
          </div>
        </div>
      )
      : null
  )
}