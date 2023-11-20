import React, { useState, useEffect } from 'react';

import Table from "../../components/Table/ResponsiveTable";
import { buildingService } from '../../utils/backendConnection/connection';
import { useAppSelector } from "../../redux/hooks";

function EditBuildings() {
    const user = useAppSelector(state => state.user.user)
    const [buildings, setBuildings] = useState();

    // TODO: I couldnt figure out how to do this page with redux state
    useEffect(() => {
        let isMounted = true;
        buildingService.get({org_id: user.org_id})
            .then((buildings) => {
                if (isMounted) {
                    setBuildings(buildings)
                }
            })
            .catch(err => {
                console.log(err)
            })
        return () => {
            isMounted = false;
        }
    }, [user])

    const onAddBuilding = async (newBuilding) =>{
        try {
            const building = await buildingService.get(newBuilding)
            if (building.length !== 0) {
                //TODO: add error handling to tell person to update existing building
                return;
            }

            await buildingService.create(newBuilding)
        } catch (err) {
            console.log(err)
        }
    }

    const onDeleteBuilding = async (building) => {
        try {
            await buildingService.delete(building.building_id)
        } catch(err) {
            console.log(err)
        }
        
    }

    const onUpdateBuilding = async (newBuilding, oldBuilding) => {
        try {
            await buildingService.update(oldBuilding.building_id, newBuilding)
        } catch (err) {
            console.log(err)
        }
    }

    const columns = [
        {title: "Address", field: "addr"},
        {title: "Name", field: "name"},
        {title: "Alias", field: "building_code"},
    ]

    return (
            <Table columns={columns} data={buildings} setData={setBuildings} onAdd={onAddBuilding} onDelete={onDeleteBuilding} onUpdate={onUpdateBuilding}/>
    )

}

export default EditBuildings;