import Button from 'react-bootstrap/Button';
import "./VerifyCSV.css"

function VerifyCSV({errAccounts, setActiveStep}) {

    const onContinue = () => {
        setActiveStep(2);
    }

    const onBack = () => {
        setActiveStep(0)
    }

    return (
        <>
        {
            (errAccounts.length !== 0 && 
                <div className="confirmation">
                    <div>
                        <h4>Found Bad Account(s) in the CSV. Please update the CSV</h4>
                        <div>
                            {errAccounts.map((err, index) => <p key={index}><b>Line {err.line}</b>: {err.message}</p>)}
                        </div>
                    </div>
                    <div className="d-flex justify-content-between w-100">
                        <div className='d-flex w-25 justify-content-center'>
                        <Button variant="outline-secondary" onClick={onBack}> Back </Button>  
                        </div>
                        <div className='d-flex w-25 justify-content-center'>
                            <Button disabled>Continue</Button>
                        </div>
                    </div>
                </div>
            )
        }
        {
            (errAccounts.length === 0 &&
                <div className="confirmation">
                    <h4>
                        No Bad Accounts Found!
                    </h4>
                    <h5>
                        Please continue to upload
                    </h5>
                    <div className="d-flex justify-content-between w-100">
                        <div className='d-flex w-25 justify-content-center'>
                        <Button variant="outline-secondary" onClick={onBack}> Back </Button>  
                        </div>
                        <div className='d-flex w-25 justify-content-center'>
                            <Button onClick={onContinue}>Continue</Button>
                        </div>
                    </div>
                </div>
            )
        }
        </>
    )

}

export default VerifyCSV;