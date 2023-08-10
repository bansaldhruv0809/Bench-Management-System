import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../Global/AuthContext';
import { useNavigate } from "react-router-dom";
import logoImage from '../../Assets/Images/accoliteLogo.png'
import { authenticator } from 'otplib';
import Login from '../Pages/Home/Login';
import '../../Assets/Styles/Project.css'
export default function ExistingUser() {
  const navigate = useNavigate();
  const authData = useContext(AuthContext);
  const [otp, setOTP] = useState("");
  const { REACT_APP_URL } = process.env;
  const [secret, setSecret] = useState("");
  const [passwordType, setPasswordType] = useState("password")

  const handleEnterKey = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      verifyOTP();
    }
  }

  function verifyOTP() {
    const isValid = authenticator.check(otp, secret);
    if (!isValid) alert("Invalid Otp");
    else {
      authData.setOtpVerify(true);
      if (authData.currentRole === "admin") {
        navigate("/admin", { replace: true })
      }
      else navigate("/manager", { replace: true })
      console.log(isValid);
    }
  }
  const getSecretKey = () => {
    axios.get(`${REACT_APP_URL}/login/getSecretKey/${authData.googleData.email}`)
      .then((res) => {
        setSecret(res.data);
        // console.log(res.data);
      })
  }
  useEffect(getSecretKey, [authData.googleData]);
  return (
    authData.isAuthentication && authData.otpVerify === false ?
      <div className='loginContainer'>
        <div>
          <img className='logoContainer' src={logoImage} alt="accoliteLogo" />
        </div>
        <div className='VerifyContainerMain'>
          <div className='parentVerifyOtpContainer'>
            <div className='parentLogoContainer'>
              <div className='logoContainer'>
                <img className='logoImage' src="https://cdn01.onelogin.com/images/brands/logos/login/eaca719f175ab8206ef09707f29ecd2377c9cf29.png?1652130055" alt="accolite-logo" />
              </div>
            </div>
            <div className='childVerifyOtpContainer'>
              <div>
                <div className='lockImageContainer'>
                  <img className='lockImage' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAYKADAAQAAAABAAAAYAAAAACpM19OAAAPFUlEQVR4Ae1de3RUxRmf727eYIDIw4JaykOs1Ef1WNTjW08RNgkPTQpJiBFpFCynhWprPVhArdqqh9Yqako1L0JMeOSN7dESrNXSU8+x0nKkqegRQR6KJCHZV/ZOf7Phhsuy97V7dzfA3j/2zp355nv8vpnvzsyde5exxJFAIIFAAoEEAgkEEggkEDgbEaDBZHRpaWnyvn2dU4jkyTKjsTiP5TKN5cTHEqMxjPEMzigNSqdzxtIY52kB/YncyHMjz0WMuxmjXs74QeK0nyS+n3Npv8QC545x44btLisr8w0Wu+PmgLy8vBS3m13bx/k0xqTLGJMvBcgXc85TogkOEXnhnI8gcydkfphEtCMtjb1XX1/vjaZcLd4xcwCAJees+VeRX75NJvlWCL6ec5ahpVgs84kYegx7R+LSX7hDequ1ccP7cBSyon9E3QHZ2T+4XGa8AK1uPkLGBdE3yQYJRHvRGzdIjGpaWl7/lw0cNVlExQEIL1k9blbKZbYAcfsSTemnRQHtIolVDUljZQhTR+xW2VYHOJ0FExj5lqG1Lxws4cUuwESYQq94lfHkNa2tNXts42sHo1mz8i7x+tlqeHMuYr1kB8/BygP3Bhk3h80pDraysbF+V6R6RtQDcnLmj/TL/tWM+H0A3hGpMqdTfTjCzzi94pAcK5ubN3wZru5hOSAwXv/i6I9lma9AjB8WrvDQ9aiLEdtNnO8miTqYzA5wSToocflQUpJ0SJKSex0Oj8ftHuFOS/vaI3ggnYp0mt+fmirLvoy+Pnm0TNJokuUxTGLncZlP5kRTGGdToG9maLnh5lIneD5+wbis58OZX1h2AFr9VL/cV404f0W4Kp+oF5hAvQ/A30Xcek+SHDuammr3nyi3P5WbO2+sLPunyYxdC4dch3ByFQDsn9BFIA73hw8cUlIResN/rLAx7YDAOD4nfxnOT0JAqhUhalooegBD7GZiUnN6On8TIwuXujzWaYzY0l0uup0zOQdTlRw0rPMi0MGD0PRIa3PdGrPzCNMOmJF91za0mJvDUQ7KuDAH2OSQaF1TU93bZpULR1YkdUQjy83Nv9Ev80WM6E5cp4fDD41sW1tr/a1m6iaZIQrQhAU+fYrw8lxK0pDqhobyo4IPwDctMtaExxvGdsjdPnt2yVJPX08RGt1PEaLGW9EFvegWs/RRGTKiBfwXN9B7pl09dfLWlvoXFPDNKjUY6ITOQndhg7BF2BQNvUw3xxnOu0ysjdAReHRFRkZg1uiPhsLx4ol7haO3l5Xi5v0EekSWkR5bWzeawtZ8CDKSKNFLQ9PYimhM141Ex6IcdokG9RIc8foxNz3BZL7YDrmmvCQEGfUAsx63Q+nBwMMuPKJyDxgMAJ0uOiQcEGdPJRyQcECcEYiz+EQPSDggzgjEWXyiByQcEGcE4iw+0QPi7AD7liLibIgV8avqpqZ87PmsxuFgFeUF3c1W6tpNe9b1AAH+Hu/ezQDyTr/MNhavHz7LblCt8DurHLC0bVLqHs/eLXjQ4gyAxFkKk/31JTXDZ1sBzU7as8YBAvzOI4e24GHJTDWAWGNPlv3+uuLq4XPU+bFKnxUOEOAf/epQA1r+jFDACidwLueHKot23hnvgJJt49PQ8hvxEOUOHTA3TTz/SmyjjP1xRo+CBPjyviONaPnf14IWj6g3Thh31fxVt7T3adFEM/+M7QHL6s5P939+pEkPfOwQqI8n+MKxZ2QPEOB/5e1qQti5Xav1YgdE3YRxVxbGq+UrelnoAYRXf7QPPCtN0S7VLyltHmvbixrHwW9Gy9cEH5tjarNTpheEC76xrfpYqdEw7wDiPeqKwene3uQhwXlmru9en7nC3dn9j/s3jxlthl6PRjjyS09nC8C/TYsOLX9DTur0ovz8wEN2LTLdfENbDbBSMzftAOyL0XUAkc9yKy6uynwUG3wfx7sEU3t6e7ctqhmNF/HCOwT4cGQLat+qxQHg16DlL4gEfMHbyFYjrNT6mXYAdojpOoAnS5Z2HS+ozvwlJkWPDSjDGd4xcIXlBAG+q7O7FY7U2ZFG6wF+caTgC30NbTXAasBmJMw7gLj+Hngvv1DNWC9dvD5zJfaKrg6mwYTo217Z1V5SN8r0BtkH/zRmiPtod5vevlW0/OqJRcttAT+gs7Gth4Nt07o27wAmfaLFpD+ff1O/3FwpWvHFste9rbRq5DeMagjwDx3ubYPjbtKiBfhVEwqX372KVmFTm12Hga2EPbEmDwsOYLoOwAsQ403KZJWFXasRSFdq0QsnuMir64QldaOGHjzcuxW0N2rxAfgVAL/EXvARgoxt1cVKra9pB+CtWV2miOffUTM2SlcVdT0mSfSoJh3nU9zM275ww8ixwTQC/GMe91aEnRuCywauicoB/kK7wRf8jWw1wmpARyTMO4C47u5gCL1azdhMuqKw6wlGEl5zCn3A0Iv6/N724rpzxykUCxtHnnPM636D40VvJS/4jJc/XptYuPzeaIAvZBnZihdQdLFS60vqC710SUlJ2sHDPV1iDKBFl56aesHmzes/1yrXyi+uGvYI3lD5lVY5QkkHS0m+JSmVunxd3jegw3XatNKrFYVHF6EOfGT/MXdu4fkuj2evNmfyjRk1JLO8vFx34qrUN90DBEN460OlYqiz2+fTBCYUvZJXuaDzSYmkR5Tr4DMmVpO5x9fe1+39sy74ElsXTfCFXkY2CozMgi/4mXaAIEbn29F/1viVQ6+3a1CflF1R1PkUSdLDJ2WedMEnwRHXnJSlusCq5h8qCrpKo9XyFVHoqSc90FHyT5wNMDpBGEhZcoBE8rtB9U++JDYDIJkOaydXZhgddf4aPeHnwfkmrstwP7kv6uDDNnwCR++5AjPEKMgYSw5ITs54A0aKFxVCHgB/TE5OvuWbsZoZesJv4MGfqfP00mj5r1QWdd0fbfCFDsI2YaOWPgIbgZFWeah8Sw7YsqXyK8Rg3V6AO1/ET5YqF3Q/I0nsoVAKq/MkopfR8hfHAnwh19g2/m4/Rmot9dOWHCBYEUlYZ9c+8CGFgqVLl4b9HrHCuaKw+1m8Yfmgch18Buhryws7l8QKfGGTsC1YD/W1ETZqWiVt2QEO4g1K5dBnnrVnzxe5ocus5VYVdT+HydryU2oRvYiw80CswBfy+23SfznPGJtTLLE6CmKsqan+f4i7fz2V1YkcmWjZiavIUggxa9DtBvhhqfcFzKJ/FBlX67WNbBKYCGyscrbcA4QADBfLdAVxfm1OTt5NujQWCgH4bwH8T+CI5ysXdC21UNUW0oAtsEmPmSEmGpXDeiY8Kitj46HDPc9jqWCEBl+GbX9iTL9dq9xqPoD/ndU6dtEft0WTHRrH1wITTQKdgrB6QP9Mj5fr8BULVnc4nfnT9WhOhzJhg7BFV1dir1mZ/ap5heUAwSDJkfQsgpFbzSw4jVnjWjzADuuDF8G84nEtdBc26Msmd5LkeE6fRrs0bAeI7/pIxNZpsw6Mmyf0usVHnU7PQ+iOsf8EPe0FBpF84yhsBwilMGN9GqfAV6u0lJRlekh8U06rfLDmC52F7gb6eY5jYECmXRyRA1pa6vdBAYMuypN9fv5yJGtE2upHp0ToKnRGH9ZceheSMQ95UWAQiRYROUAIHjE8dRVGAQf0lMBjwxuys/N/qEczmMqErkJnA52+GDEsZbUBjWFxxF863Llzp2fKlEsOIFbO1ZVGNP2iyZdt7+j492e6dHEudDrn3YCPhddCDV1sHMQWb9r0+j8jVRcRxJ5jRnZeO7aaGEy+6IiDkq9paanpsEeqvVyyswsm+7nv7wg9WbqcibbjY04369KYLIw4BClykojdg6jYpVyHPvMsP/O1zZlTfG7o8vjlCp2Ebobgw8Z+W+3R1TYHNDfXfyI56AFDtTif5Pa5GuxYMTWUZZJA6CJ0Qg+eZFRF2ChsNaIzW25bCFIEzszOW49RhO6ybYCWpNqh6bzo+JeolOoxP2Oy5TjmomrG5XlGwjHqqWlrqS80orNSblsPUIRiZLAYoWiXcq15hsHHXKwpN3fhOZo0US4QsoUOZsAXNvXbZq9StvcAoR5WD7/VJzM8wOejDNUlJv7FIgfdOqajI+h4IRbZWrDOc6mhjowOJ0lsmp2hR5Fpew8QjAOKOmgOkrqz5IASnF0GIHZkZ+d9L3Adgx8hS8g0Bz5sgC3RAF+YGhUHCMZbm+r+hjXyYsRNzYf4gk4cAOI87JxtdzrvyuvPid6vkCFkCZlGUoTuwgZhixFtuOVRCUFqZWbm5BUA4UrcmHUnNsfrYN8HWzsknR7GzfmYmk+kadxsh/a4+NOY4S4BL0O7Aw2HWHFbc31NpLL16hsqolfZbJkzN78In5CvgBNM9jj61EGORS0ttW+ZlaFHl5097zY/92Pllo/Xo1PKAD6+fk93tzbVVSt50TrHxAFC+Zk5+flcliuRNL9jgmhLssR+gWetu8MBIDc3b4pPZk9hfC/uR2YPjwg7bc11dWYrREIXMwcIJZ2z5l3H/X7x4vRIC0r3ISytI57yjNn/bhH/ZcPJ+xDCzSLIMf3YFS3/S3I4ZrU21urufbKguyFpTB0gtDkOjnif62JD7VQEIiygJTfgE/hrMCJ5R1U0kMTQ8np8en4Z1olnmw93/dXh5I/gZKdZJw8IjTARcwcIfcUEqM/ftRYrqEXh6U8fo16txCSxaol/OQnMYjGT5RPD4QcQqpMcmUuaml7tDqd+JHXi4gBF4f6bs7wWvSEus2G0+m7E+yWxuNkqNgef4+oAoUwgJDHfKxiX3x6sXDSv8RDpTWLJ98U65ATbFHcHKAqJCRImAWsQuwdeR1LK7DzjXrIP/9C0rLV1Y72dfMPlZWZyFC5vS/U6OnbtuuLyqWV9mDfjL2u/i8oplhgYERMdw47rZzHJm9fQsPEDI/JYlQ+aHqA2WDwccXtdy5C3FO6w9Aa+mk9/OvCQ6PdpKelrrG4dP5WX/TmD0gGKmbg/jGCsr5STfC9u1JOVfDNn3GA7iEt/xDSgDHH+azN14kEzqB2gBkRskBV/L4X7xGzMB4aqywbSCDOI72KusA5zhe0D+YM4cdo4QMEQi2opvb10oywxJ3HZKfI5Sa2SzFozMvjbWMTzKrSJcwKBBAIJBBIIJBBIIJBAIIHAYEXg/8arXABu08T/AAAAAElFTkSuQmCC" alt="lock" />
                  <div className='googleAuthContainerContent'>
                    <span className='spanClassGoogleAuth'>
                      Google Authenticator
                    </span>
                  </div>
                </div>
                <form className='VerifyAuthInputForm'>
                  <div className='VerifyAuthInputFormChild1'>
                    <div className='VerifyAuthInputFormLabel'>
                      <div className='FormLabel1'>
                        <label className='FormLabel1Child' htmlFor="security-code">
                          <span>
                            Enter your code
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
                          onKeyDown={(e) => handleEnterKey(e)}
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
                          <span className='VerifyAuthButtonSpan'>Continue</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      :
      (
        <Login />
      )
  )
}
