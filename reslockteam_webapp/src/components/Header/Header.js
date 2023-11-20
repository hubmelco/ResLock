import React from "react"
import "./Header.css";
import logo from "../../assets/white_logo.png";
import accountIcon from "../../assets/AccountIcon.png"
import Dropdown from "react-bootstrap/Dropdown";
import app from "../../utils/backendConnection/connection";
import { useNavigate } from "react-router-dom";
import {useAppSelector} from "../../redux/hooks";

const Header = () => {
    const navigate = useNavigate();
    const {first_name, last_name} = useAppSelector(state => state.user.user)
    // we should use redux to store the user. Would make getting name easier. I dont think any of the pages can pass in the name (hard coded in App.js rn)

    const logout = () => {
        app.logout();
        navigate("/")
    }

    return(

        <header className="header">
            <img src={logo} alt="ResLock Logo" className="logo"/>
            {/* Maybe make a better dropdown cuz bootstrap is difficult. For now or forever !important in css */}
            {first_name && last_name &&
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic" className="dropdown">
                        {first_name + " " + last_name + " "}
                        <img src={accountIcon} alt="account icon" className="icon"/>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={logout} >Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            }
        </header>
    )

};

export default Header;
