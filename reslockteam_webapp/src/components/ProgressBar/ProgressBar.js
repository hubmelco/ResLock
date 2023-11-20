import React, { useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import "./ProgressBar.css"
import CSVUpload from '../CSVUpload/CSVUpload';
import VerifyCSV from '../VerifyCSV/VerifyCSV';
import CSVConfirm from '../CSVConfirm/CSVConfirm';

function ProgressBar({steps, activeStep, setActiveStep}) {

    const [errAccounts, setErrAccounts] = useState([]);
    const [validAccounts, setValidAccounts] = useState([]);

    return (
        <div className='stepper'>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepButton color="inherit">
                        {label}
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
            {activeStep === 0 && <CSVUpload setActiveStep={setActiveStep} setErrAccounts={setErrAccounts} setValidAccounts={setValidAccounts}/>}
            {activeStep === 1 && <VerifyCSV setActiveStep={setActiveStep} errAccounts={errAccounts}/>}
            {activeStep === 2 && <CSVConfirm setActiveStep={setActiveStep} validAccounts={validAccounts}/>}
        </div>
    )

}

export default ProgressBar;