import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { residentUploadService } from '../../utils/backendConnection/connection';
import "./CSVConfirm.css"
import { TiInputChecked } from "react-icons/ti"
import { IconContext } from 'react-icons/lib';


function CSVConfirm({setActiveStep, validAccounts}) {

    const [err, setErr] = useState();
    const [requestSent, setRequestSent] = useState(false);

    const onBack = () => {
        setActiveStep(1)
    }

    const onUpload = async () => {
        try {
            setRequestSent(true)
            await residentUploadService.create(validAccounts);
        } catch (err) {
            setErr(true) // can change to JSON.stringify(err) and change the p tag to be {err} to show the error
        }
        // TODO: Maybe add a set active step 4 for upload complete?
    }

    return (
        <div className="confirmation">
            {(!requestSent && 
                <>
                    <h4>You are about to upload a csv of residents</h4>
                    <h5>This action cannot be undone</h5>
                </>
            )}
            {( requestSent && !err &&
                <>
                    <IconContext.Provider value={{ className: "top-react-icons" }}>
                        <TiInputChecked width={200}/>
                    </IconContext.Provider>
                    <h3>
                        Residents Added Successfully!
                    </h3>
                </>
            )}
            { err &&
                <div className="error">
                    <h4>An Unexpected Error Occurred</h4>
                    {/* Server err can send SQL table and column data and I didn't want to display that to the user in case of some security thing*/}
                    <p>Ensure duplicate residents have not been added by looking at the "MANAGE RESIDENTS" tab and that the CSV has valid data</p>
                </div>
            }
            <div className="d-flex justify-content-between w-100">
                <div className='d-flex w-25 justify-content-center'>
                  <Button variant="outline-secondary" onClick={onBack}> Back </Button>  
                </div>
                <div className='d-flex w-25 justify-content-center'>
                    <Button onClick={onUpload}>Upload Residents</Button>
                </div>
            </div>
        </div>
    )

}

export default CSVConfirm;