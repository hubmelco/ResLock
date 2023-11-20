import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import './Login.css'
import logo from '../../assets/dark_blue_logo.png';
import { useAppDispatch } from '../../redux/hooks';
import { updateUser } from '../../redux/reducers/userSlice';
import { updateOrg } from '../../redux/reducers/organizationSlice';
import app, {orgService, buildingService} from '../../utils/backendConnection/connection';
import { toast } from 'react-toastify';

function Login() {
    const [loginModal, setLoginModal] = useState(true);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        app.login()
          .then((user) => {
            dispatch(updateUser(user));
            // Get the org and buildings at the same time
            Promise.all([orgService.get(user.org_id), buildingService.get({org_id: user.org_id})])
              .then(([orgArray, buildings]) => {
                const org = orgArray[0];
                org.buildings = buildings;
                dispatch(updateOrg(org));
                navigate("/dashboard");
              })
              .catch(err => {
                // do nothing
              })
          })
          .catch((err) => {
            // Do nothing
          });
    }, [dispatch, navigate])

    const [login, setLogin] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState({status: false, message: ""})

    const handleChange = (e) => {
        const {name, value} = e.target;
        setLogin(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const onLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await app.login(login);
            dispatch(updateUser(user));
            const [org] = await orgService.get(user.org_id);
            const buildings = await buildingService.get({org_id: user.org_id});
            org.buildings = buildings;
            dispatch(updateOrg(org));
            navigate("/dashboard")
        } catch (err) {
            setError(prevState => ({...prevState, status: true, message: err.error}))
        }
    }

    const onResetPassword = () => {
        try {
            app.sendVerificationCodeToEmail(login.email);
            toast.success("Email Sent! It will arrive shortly.");
        } catch (error) {
            toast.error("Could not send link to email. Try Again.")
        }
    }

    return(
        <div className="background">
            <div className="login-container">
                <img src={logo} alt="" width={200} className="reslock"/>
                <div className='login-form'>
                {loginModal ?
                    <div id='form' className='show-password'>
                        <TextField autoFocus={true} id="emailField" name="email" label="Email" error={error.status} value={login.email} onChange={handleChange}/>
                        <TextField id="passwordField" name="password" label='Password' error={error.status} type={"password"} value={login.password} onChange={handleChange} helperText={error.message}/>
                        <Link component="button" onClick={() => {setLoginModal(false)}}>
                            Forgot Your Password?
                        </Link>
                        <Button className="button" variant="contained" onClick={onLogin}>Log In</Button>
                    </div>
                : 
                    <div className='login-form show-password'>
                        <h5 className='pt-3'>
                            Forgot Your Password?
                        </h5>
                        <p>
                            Enter your email below to receive a reset link
                        </p>
                        <TextField autoFocus={true} id="emailField" name="email" label="Email" error={error.status} value={login.email} onChange={handleChange}/>
                        <Button className="button" variant="contained" onClick={onResetPassword}>Reset Password</Button>
                        <div className='d-flex flex-row align-items-center w-75'>
                            <div className='d-flex pt-3 w-75'>
                                <p>
                                    Know Your Password?
                                </p>
                            </div>
                            <Link component="button" onClick={() => {setLoginModal(true)}}>
                                Log In
                            </Link>
                        </div>
                    </div>
                }
                </div>
            </div>
        </div>
    )
}
export default Login;