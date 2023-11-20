import mysql from 'mysql2';
import { organizationInfo } from '../database-types';
import connection from '../db-service';

/**
 * Class containing CRUD functions for querying the database
 * @author Roberto Garcia
 */
export default class Organization{
    get(query: Record<string, string>) {
        const cleaned_query:string = mysql.escape(query).replace(/,+/g, ' AND');
        return new Promise((resolve, reject) => {
            connection.query<organizationInfo[]>(`SELECT * FROM organization WHERE ${cleaned_query}`, (err, results) => {
                if(err) reject(err);
                resolve(results);
            });
        });
    }

    getAllOrganizations():Promise<organizationInfo[]>{
        return new Promise((resolve, reject) => {
            connection.query<organizationInfo[]>('SELECT * FROM organization', (err, results) => {
                if(err) reject(err);
                resolve(results);
            });
        });
    }
    getOrganizationById(id:number):Promise<organizationInfo[]>{
        return new Promise((resolve, reject) => {
            connection.query<organizationInfo[]>('SELECT * FROM organization WHERE org_id = ?', [id], (err, results) => {
                if(err) reject(err);
                resolve(results);
            });
        });
    }
    createOrganization(body:organizationInfo){
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO organization SET ?', [body], (err, results) => {
                if(err) reject(err);
                console.log(results);
                resolve(results);
            });
        });
    }
    updateOrganization(id: number, body:organizationInfo){
        return new Promise((resolve, reject) => {
            connection.query('UPDATE organization SET ? WHERE org_id = ?', [body, id], (err, results) => {
                if(err) reject(err);
                resolve(results);
            });
        });
    }
    deleteOrganizationById(id:number){
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM organization WHERE org_id = ?', [id], (err, results) => {
                if(err) reject(err);
                console.log(results);
                resolve(results);
            });
        });
    }
}