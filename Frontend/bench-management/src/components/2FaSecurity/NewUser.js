import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../Global/AuthContext';
import { useNavigate } from "react-router-dom";
import logoImage from '../../Assets/Images/accoliteLogo.png'
import qrcode from 'qrcode';
import { authenticator } from 'otplib';
import axios from 'axios';
import Login from '../Pages/Home/Login';
const newUser = {
    otpSecret: null
};
export default function NewUser() {
    const authData = useContext(AuthContext);
    const navigate = useNavigate();
    const [imageURL, setImageURL] = useState(null);
    const [otp, setOTP] = useState("");
    const { REACT_APP_URL } = process.env;
    const [passwordType, setPasswordType] = useState("password")

    const handleEnterKey = (event) => {
        if(event.key === 'Enter') {
            event.preventDefault();
            verifyOTP();
        }
    }

    function generateQR() {
        // const secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';
        // authenticator.options = {
        //     encoding: 'ascii'
        // }
        // setSecret(authenticator.generateSecret(20)); // base32 encoded hex secret key
        const token = authenticator.generate(newUser.otpSecret);
        // setSecret(authData.secret);
        console.log("token : " + token);
        const user = authData.googleData.email;
        const service = 'Bench Management';
        const otpauth = authenticator.keyuri(user, service, newUser.otpSecret);
        qrcode.toDataURL(otpauth, (err, url) => {
            if (err) {
                alert(err)
            }
            else {
                console.log(url);
                setImageURL(url);
            }
        });
    }
    console.log(authData.mfaEnabled);
    useEffect(() => {
        if(authData.mfaEnabled == 0) {
        newUser.otpSecret = authenticator.generateSecret(20);
        console.log(newUser.otpSecret);
        generateQR();
        }
    },[]);

    const verifyOTP = async () => {
        const isValid = authenticator.check(otp, newUser.otpSecret);
        if (!isValid) {
            alert("invalid otp");
        } else {
            try {
                await axios.post(`${REACT_APP_URL}/login/saveSecret/${authData.googleData.email}`, newUser.otpSecret, {
                    headers: { 'Content-Type': 'text/plain' }
                }
                ).then((res) => {
                    console.log(res.data);
                    authData.setMfaEnabled(true);
                    navigate("/verify2fa", { replace: true });
                })
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        authData.isAuthentication && authData.mfaEnabled == false ?
            <div className='loginContainer'>
                <div>
                    <img className='logoContainer' src={logoImage} alt="accoliteLogo" />
                </div>
                <div className='VerifyContainerMain'>
                    <div className='parentNewUserContainer'>
                        <div className='parentLogoContainer'>
                            <div className='logoContainer'>
                                <img className='logoImage' src="https://cdn01.onelogin.com/images/brands/logos/login/eaca719f175ab8206ef09707f29ecd2377c9cf29.png?1652130055" alt="accolite-logo" />
                            </div>
                        </div>
                        <div className="">
                            <span className='SecretKeySpan'>Open Authenticator app and scan QR bellow</span>
                            {imageURL !== null && (
                                <div className='qrcodeImageContainer'>
                                    <img alt="qr" src={imageURL}></img>
                                </div>
                            )}
                            <div className='SecretKeyContainer'>
                                <span id='SecretKeySpanSeparator'>or</span>
                                <span className='SecretKeySpan'>Paste the Secret Key manually</span>
                                <span className='SecretKeySpan2'>{newUser.otpSecret}</span>
                            </div>
                        </div>
                        <form className='VerifyAuthInputForm'>
                            <div className='VerifyAuthInputFormChild1'>
                                <div className='NewUserAuthInputFormLabel'>
                                    <div className='FormLabel1'>
                                        <label className='FormLabel1Child' htmlFor="security-code">
                                            <span>
                                                Verification code
                                            </span>
                                        </label>
                                    </div>
                                    <div className='FormLabel2'>
                                        <input
                                            className='FormLabel2Input'
                                            type={passwordType}
                                            autoComplete='off'
                                            autoCorrect='off'
                                            spellCheck='false'
                                            maxLength={6}
                                            id='security-code'
                                            value={otp}
                                            autoFocus="autofocus"
                                            placeholder='Enter six digit code'
                                            onKeyDown={(e)=> handleEnterKey(e)}
                                            onChange={(e) => setOTP(e.target.value)}
                                        />
                                        <div className='showPassword'>
                                            <button className='showPasswordButton' type='button' onClick={(e) => { if (passwordType === "password") setPasswordType("text"); else setPasswordType("password") }}>
                                                <span>{passwordType === "password" ? "Show" : "Hide"}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className='VerifyAuthInputFormField'>
                                    <div className='VerifyAuthButtonContainer'>
                                        <button className='VerifyAuthButton' type='button' onClick={verifyOTP}>
                                            <span className='VerifyAuthButtonSpan'>Verify</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            :
            <Login />
    )
}
