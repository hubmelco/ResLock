import React, { useState, useEffect } from 'react';
import Table from "../../components/Table/ResponsiveTable";
import { superAdminService } from '../../utils/backendConnection/connection';
import { useAppSelector } from '../../redux/hooks';

function ManageResidents() {
    const [residents, setResidents] = useState();
    const buildings = useAppSelector(state => state.organization.organization.buildings);

    useEffect(() => {
        fetchAdmins()
    }, [])

    const onAddResident = async (newResident) =>{
        try {

            // SEE IF USER EXISTS ALREADY
            const user = await superAdminService.get({email: newResident.email})

            // USER EXISTS
            if (user.length !== 0) {
                await superAdminService.update(newResident.email, {privilege: 3, org_id: 1})
                setResidents([...residents, user[0]]);
                return;
            }

            // OTHERWISE USER DOES NOT EXIST, CREATE THEM
            newResident.privilege = 3;
            newResident.org_id = 1;

            await superAdminService.create(newResident)

            setResidents([...residents, newResident]);
        } catch (err) {
            console.log(err)
        }
    }

    const onDeleteAdmin = async (oldResident) => {
        try {
            await superAdminService.delete(oldResident.email)
        } catch(err) {
            console.log(err)
        }
        
    }

    const onUpdateAdmin = async (newResident, oldResident) => {
        try {
            await superAdminService.update(oldResident.email, newResident)
        } catch (err) {
            console.log(err)
        }
    }

    async function fetchAdmins() {
        const res = await superAdminService.get({privilege: 3})
        setResidents(res) 
    }

    const formatBuildings = () => {
        if (!buildings){
            return {}
        }
        return buildings.reduce((obj, item) => Object.assign(obj, {[item.building_id]: item.name}), {})
    }

    const columns = [
        {title: "First Name", field: "first_name"},
        {title: "Last Name", field: "last_name"},
        {title: "Email", field: "email"},
        {title: "Building", field: "building_id", lookup: formatBuildings()},
        {title: "Room Number", field: "room"}
    ]

    return (
        <div>
            <Table columns={columns} data={residents} setData={setResidents} onAdd={onAddResident} onDelete={onDeleteAdmin} onUpdate={onUpdateAdmin}/>
        </div>
    )

}

export default ManageResidents;