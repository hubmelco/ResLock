import ProgressBar from '../../components/ProgressBar/ProgressBar';
import { useState } from 'react';
import { Importer, ImporterField } from 'react-csv-importer';
import "./UploadResidents.css";


function UploadResidents() {

    const [activeStep, setActiveStep] = useState(0);

    return (
        <>
            <ProgressBar steps={['Import CSV', 'Validate Data', 'Confirm Upload']} activeStep={activeStep} setActiveStep={setActiveStep}/>
        </>
    )

}

export default UploadResidents;