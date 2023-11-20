import React, { useState, useEffect, useCallback } from 'react';
import {useSearchParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import app from '../../utils/backendConnection/connection';
import { toast } from 'react-toastify';
import './ResetPassword.css'

function ResetPassword() {
    const [resetPassword, setResetPassword] = useState({
        password: "",
        confirmPassword: "",
        email: ""
    });

    const [verifyOTP, setVerifyOTP] = useState({
        valid: false,
        message: "Loading..."
    });

    const [error, setError] = useState(false);

    const [queryParameters] = useSearchParams();

    const handleChange = useCallback((e) => {
        e.preventDefault();
        const {name, value} = e.target;
        setResetPassword(prevState => ({
            ...prevState,
            [name]: value
        }));
    }, []);

    useEffect(() => {
        resetPassword.password !== resetPassword.confirmPassword ? setError(true) : setError(false)
    }, [resetPassword])

    const onReset = (e) => {
        e.preventDefault();
        try {
            app.changePassword({password: resetPassword.password, otp: queryParameters.get("otp")})
            toast.success("Password Reset!")
        } catch (error) {
            toast.error("Unable to reset password")
        }
    }

    const onResend = () => {
        try {
            app.sendVerificationCodeToEmail(resetPassword.email);
            toast.success("Email Sent! It will arrive shortly.");
        } catch (error) {
            toast.error("Could not send link to email. Try Again.")
        }
    }

    // need this to run once upon page render to check validity of OTP
    useEffect(() => {
        const verify = async () => {
            const res = await app.verifyEmailCode({otp: queryParameters.get("otp")})
            setVerifyOTP(res)
        }
        verify()
    }, [queryParameters]);

    return(
        <div className="background">
            {verifyOTP.valid &&
                <div className="cardContainer">    
                    <div className='pt-5 pb-5'>
                        <h2>
                            Reset Password
                        </h2>
                    </div>            
                    <div id='form' className='reset-form h-75'>
                        <TextField autoFocus={true} id="password" name="password" label="Password" error={error} value={resetPassword.password} onChange={handleChange} type={"password"}/>
                        <TextField id="confirmPassword" name="confirmPassword" label='Confirm Password' error={error} type={"password"} value={resetPassword.confirmPassword} onChange={handleChange} helperText={error && "Passwords must match" }/>
                        <div className='pt-5 w-100'>
                            <Button disabled={error | !resetPassword.password | !resetPassword.confirmPassword} className="button" variant="contained" onClick={onReset}>Reset Password</Button>
                        </div>
                    </div>
                </div> 
            }
            {!verifyOTP.valid &&
                <div className="cardContainer">    
                    <div className='pt-5 pb-5'>
                        <h2>
                            {verifyOTP.message}
                        </h2>
                    </div>            
                    <div id='form' className='reset-form h-75'>
                        <TextField autoFocus={true} id="email" name="email" label="Email" error={error} value={resetPassword.email} onChange={handleChange}/>
                        <div className='pt-5 w-100'>
                            <Button disabled={!resetPassword.email} className="button" variant="contained" onClick={onResend}>Resend Code</Button>
                        </div>
                    </div>
                </div> 
            }
        </div>
    )
}

export default ResetPassword;