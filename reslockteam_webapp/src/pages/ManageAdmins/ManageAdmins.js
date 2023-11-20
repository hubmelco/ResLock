import React, { useState, useEffect } from 'react';
import Table from "../../components/Table/ResponsiveTable";
import { superAdminService } from '../../utils/backendConnection/connection';
import { useAppSelector } from '../../redux/hooks';

function ManageAdmins() {

    const [admins, setAdmins] = useState();
    const buildings = useAppSelector(state => state.organization.organization.buildings);

    useEffect(() => {
        fetchAdmins()
    }, [])

    const onAddAdmin = async (newAdmin) =>{
        try {

            // SEE IF USER EXISTS ALREADY
            const user = await superAdminService.get({email: newAdmin.email})

            // USER EXISTS
            if (user.length !== 0) {
                await superAdminService.update(newAdmin.email, {privilege: 1, org_id: 1})
                setAdmins([...admins, user[0]]);
                return;
            }

            // OTHERWISE USER DOES NOT EXIST, CREATE THEM
            newAdmin.room = 0;
            newAdmin.privilege = 1;
            newAdmin.org_id = 1;

            await superAdminService.create(newAdmin)

            setAdmins([...admins, newAdmin]);
        } catch (err) {
            console.log(err)
        }
    }

    const onDeleteAdmin = async (oldAdmin) => {
        try {
            await superAdminService.delete(oldAdmin.email)
        } catch(err) {
            console.log(err)
        }
        
    }

    const onUpdateAdmin = async (newAdmin, oldAdmin) => {
        try {
            await superAdminService.update(oldAdmin.email, newAdmin)
        } catch (err) {
            console.log(err)
        }
    }

    async function fetchAdmins() {
        const res = await superAdminService.get({privilege: 1})
        setAdmins(res) 
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
    ]

    return (
        <div>
            <Table columns={columns} data={admins} setData={setAdmins} onAdd={onAddAdmin} onDelete={onDeleteAdmin} onUpdate={onUpdateAdmin}/>
        </div>
    )

}

export default ManageAdmins;