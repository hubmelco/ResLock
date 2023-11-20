import { userInfo } from '../database-types';
import connection from '../db-service';
import {sendOTP} from '../verification/verification.class';
import mysql from 'mysql2';
export default class User{
    /**
     * Get all users
     * @returns Resolves with an array of User objects or error
     */
    getAllUsers():Promise<userInfo[]>{
        return new Promise((resolve, reject) => {
            connection.query<userInfo[]>('SELECT * FROM user', (err, results) => {
                if(err) reject(err);
                resolve(results);
            });
        });
    }
    /**
     * Gets a user by email
     * @param email unique identifier for user
     * @returns Resolves with a User object or error
     */
    getUser(email:string): Promise<userInfo[]>{
        return new Promise((resolve, reject) => {
            connection.query<userInfo[]>('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
                if(err) reject(err);
                resolve(results);
            });
        });
    }
    /**
     * Version of getUser that only returns non-sensitive information
     * @param email the email to search by
     * @param org_id the organization id to restrict the search by
     * @returns a user object or error
     */
    getUserRestricted(email:string, org_id: number): Promise<userInfo[]>{
        return new Promise((resolve, reject) => {
            connection.query<userInfo[]>('SELECT email, first_name, last_name, room, privilege, org_id, building_id FROM user WHERE email = ? AND org_id = ?', [email, org_id], (err, results) => {
                if(err) reject(err);
                resolve(results);
            });
        });
    }
    /**
     * Gets user using any other parameter (except email)
     * @param query object containing the parameters to search by
     * @returns resolves with a User object or error
     */
    userLookUp(query: object): Promise<userInfo[]>{
        const cleaned_query:string = mysql.escape(query).replace(/,+/g, ' AND');
        return new Promise((resolve, reject) => {
            connection.query<userInfo[]>(`SELECT email, first_name, last_name, room, privilege, org_id, building_id FROM user WHERE ${cleaned_query}`, (err, results) => {
                if(err) reject(err);
                resolve(results);
            });
        });
    }
    /**
     * Create operation
     * @param body the user object to be created
     * @returns resolves with a sql object containing the nuber of rows affected or error
     */
    createUser(body:userInfo): Promise<any>{
        return new Promise((resolve, reject) => {
            // Make sure the user is not verified
            body.verified = false;
            // "?" Prevents SQL injection
            connection.query('INSERT INTO user SET ?', [body], (err, results) => {
                if(err) reject(err);
                resolve(results);
            });
        });
    }
    /**
     * Update operation
     * @param body the user object to be updated
     * @returns SQL object containing the number of rows affected or error
     */
    updateUser(email:string, body:userInfo):Promise<any>{
        return new Promise((resolve, reject) => {
            connection.query('UPDATE user SET ? WHERE email = ?', [body, email], (err, results) => {
                if(err) reject(err);
                resolve(results);
            });
        });
    }
    /**
     * Delete Operation
     * @param email the email of the user to be deleted
     * @returns SQL object containing the number of rows affected or error
     */
    deleteUser(email:string):Promise<any>{
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM user WHERE email = ?', [email], (err, results) => {
                if(err) reject(err);
                resolve(results);
            });
        });
    }
}