import React, {useState} from "react"
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button"

import "./EditOrg.css"
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { updateOrg } from "../../redux/reducers/organizationSlice"
import {orgService} from "../../utils/backendConnection/connection"


function EditOrg() {
    const org = useAppSelector(state => state.organization.organization)
    const dispatch = useAppDispatch()
    const [name, setName] = useState(org.name)

    const onSave = async () => {
        try {
            await orgService.update(org.org_id, {name: name});
            dispatch(updateOrg({...org, name: name}));
            // TODO: add a success toast
        } catch (err) {
            //TODO: add an error toast
        }
    }

    const handleChange = (e) => {
        const {value} = e.target;
        setName(value);
    };

    return (
        <div id="form">
            <p>Current Organization Name: {org.name}</p>
            <TextField autoFocus={true} id="nameField" name="name" label="New Organization Name" onChange={handleChange}/>
            <Button className="button" variant="contained" onClick={onSave} size="small">Save</Button>
        </div>
    )

}

export default EditOrg;