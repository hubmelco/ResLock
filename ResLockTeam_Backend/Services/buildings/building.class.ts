import { buildingInfo } from '../database-types';
import connection from '../db-service';
import mysql from 'mysql2';

export default class Building {
    /**
     * Read Using ID Operation
     * @param building_id id of the building to find
     * @returns resolves with a building info object or error
     */
    getBuildingById(building_id:number): Promise<buildingInfo[]>{
        return new Promise((resolve, reject) => {
            connection.query<buildingInfo[]>('SELECT * FROM building WHERE building_id = ?', [building_id], (err, results) => {
                if(err) reject(err);
                resolve(results);
            });
        });
    }
    /**
     * Read Using Org ID Operation
     * @param org_id organization the building belongs to
     * @returns resolves with a building info array or error
     */
    getBuildingsByOrgId(org_id:number): Promise<buildingInfo[]>{
        return new Promise((resolve, reject) => {
            connection.query<buildingInfo[]>('SELECT * FROM building WHERE org_id = ?', [org_id], (err, results) => {
                if(err) reject(err);
                resolve(results);
            });
        });
    }
    /**
     * Read Using Address Operation
     * @param addr address of the building to find
     * @returns resolves with a building info array or error
     */
    getBuildingByAddress(addr:string): Promise<buildingInfo[]>{
        const ready_addr :string = mysql.escape(addr).replace(/'+/g, '');
        return new Promise((resolve, reject) => {
            connection.query<buildingInfo[]>(`SELECT * FROM building WHERE addr like '${ready_addr}%'`, (err, results) => {
                if(err) reject(err);
                resolve(results);
            });
        });
    }

    buildingLookUp(query: object): Promise<buildingInfo[]>{
        const cleaned_query:string = mysql.escape(query).replace(/,+/g, ' AND');
        return new Promise((resolve, reject) => {
            connection.query<buildingInfo[]>(`SELECT * FROM building WHERE ${cleaned_query}`, (err, results) => {
                if(err) reject(err);
                resolve(results);
            });
        });
    }

    /**
     * Create operation
     * @param body the building object to be created
     * @returns resolves with a sql object containing the nuber of rows affected or error
     */
    createBuilding(body:buildingInfo): Promise<any>{
        return new Promise((resolve, reject) => {
            //? prevents SQL injection
            connection.query('INSERT INTO building SET ?', [body], (err, results) => {
                if(err) reject(err);
                resolve(results);
            });
        });
    }
    /**
     * Update operation
     * @param body building info object to be updated
     * @returns resolves with a sql object containing the nuber of rows affected or error
     */
    updateBuildingId(id: string, body:buildingInfo):Promise<any>{
        return new Promise((resolve, reject) => {
            connection.query('UPDATE building SET ? WHERE building_id = ?', [body, id], (err, results) => {
                if(err) reject(err);
                resolve(results);
            });
        });
    }
    /**
     * Delete operation
     * @param building_id id of the building to be deleted
     * @returns resolves with a sql object containing the number of rows affected or error
     */
    deleteBuildingById(building_id:number):Promise<any>{
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM building WHERE building_id = ?', [building_id], (err, results) => {
                if(err) reject(err);
                resolve(results);
            });
        });
    }
}
