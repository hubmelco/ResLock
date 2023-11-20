import { useEffect, useState } from 'react';
import { Importer, ImporterField } from 'react-csv-importer';
import "./CSVUpload.css";
import { useAppSelector } from '../../redux/hooks';

function CSVUpload({setActiveStep, setErrAccounts, setValidAccounts}) {
    const user = useAppSelector(state => state.user.user)
    const buildings = useAppSelector(state => state.organization.organization.buildings)
    const [residents, setResidents] = useState([]);

    // This is needed so that if a user clicks back on VerifyCSV.js, errors and valid accounts aren't kept after changes are made
    useEffect(() => {
        // Reset arrays
        setErrAccounts([])
        setValidAccounts([])
    }, [setErrAccounts, setValidAccounts])

    const onUpload = (preview) => {
        const emails = {}
        const nameRegex = /^[\w']+-?[\w']+$/
        const roomRegex = /^[\w]+$/
        // May need to update, emails allow a lot of stuff and its hard to account for everything
        const emailRegex = /^[\w.-]+@[\w-]+\.[a-zA-Z]{2,4}$/
        const newRes = residents.reduce((accumulator, data) => {
            // The line in the CSV where the acc can be found
            const line = preview.skipHeaders ? accumulator.length + 1 : accumulator.length + 2;
            // Format checks
            if (!data?.first_name.match(nameRegex)) {
                const error = {line: line, message: `Invalid first name format "${data.first_name}". Ensure "First Name" field is not empty and only letters and '-' or apostrophes are used`} // Actually allows numbers too but shhhhh
                setErrAccounts(prevState => [...prevState, error])
            }
            if (!data?.last_name.match(nameRegex)) {
                const error = {line: line, message: `Invalid last name format "${data.last_name}". Ensure "Last Name" field is not empty and only letters and '-' or apostrophes are used`}
                setErrAccounts(prevState => [...prevState, error])
            }
            if (!data?.room.match(roomRegex)) {
                const error = {line: line, message: `Invalid room number format "${data.room}". Ensure "Room Number" field is not empty and only numbers are used`}
                setErrAccounts(prevState => [...prevState, error])
            }
            if (!data?.email.match(emailRegex)) {
                const error = {line: line, message: `Invalid email format "${data.email}". Ensure "Email" field is not empty and valid (local-part1@domain.com)`}
                setErrAccounts(prevState => [...prevState, error])
            }
            // Duplicate email check
            if (emails[data.email]) {
                const error = {line: line, message: `Duplicate email found "${data.email}". Same email on line ${emails[data.email]} of CSV`}
                setErrAccounts(prevState => [...prevState, error])
            }
            emails[data.email] = line; // Update emails map to contain the email
            // Building is checked in map building using what the database has.
            
            //Update data to be valid for backend after all checks
            data.org_id = user.org_id;
            data.building_id = mapBuilding(data, line);
            delete data.building_code;
            accumulator.push(data);
            return accumulator
        }, []) // Accumulator starts as an empty array
        setResidents(newRes)
    }
      
    const redirect = () => {
        setValidAccounts(residents)
        setActiveStep(1)
    }

    const mapBuilding = (data, line) => {
        const match = buildings.filter(building => {
            return building.building_code.toLowerCase() === data.building_code.toLowerCase() // Make sure case does not matter
        })
        // If there is a match return the match
        if (match.length !== 0) {
            return match[0].building_id;
        } 
        const error = {line: line, message: `Could not find building code "${data.building_code}" in your organization. Refer to the "EDIT BUILDINGS" tab for a list of valid codes(aliases)`}
        setErrAccounts(prevState => [...prevState, error])
        // return -1 as the building id to ensure req doesnt go through later
        return -1;
    }

    return (
        <div className='importer'>
            <Importer
                onComplete={({preview}) => {
                    onUpload(preview);
                }}
                onStart={() => {
                    setResidents([])
                }}
                dataHandler={(newRows) => {
                    setResidents(newRows)
                }}
                onClose={() => {
                    redirect();
                }} 
            >
                <ImporterField name="first_name" label="First Name"/>
                <ImporterField name="last_name" label="Last Name"/>
                <ImporterField name="email" label="Email"/>
                <ImporterField name="building_code" label="Building Code"/>
                <ImporterField name="room" label="Room Number"/>
            </Importer>
        </div>
    )

}

export default CSVUpload;