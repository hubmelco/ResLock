import { mailInfo } from '../database-types';
import mysql from 'mysql2';
import connection from '../db-service';


export default class Mail {
    //gets one package
    getMailById(mail_id:number): Promise<mailInfo[]>{
        return new Promise((resolve, reject) => {
            connection.query<mailInfo[]>('SELECT * FROM mail WHERE mail_id = ?', [mail_id], (err, results) => {
                if(err) reject(err);
                resolve(results);
            });
        });
    }

    //gets packages based on passed in query
    get(query: Record<string, string>) : Promise<mailInfo[]>{ 
        const cleaned_query:string = mysql.escape(query).replace(/,+/g, ' AND');
        return new Promise((resolve, reject) => {
            connection.query<mailInfo[]>(`SELECT * FROM mail WHERE ${cleaned_query}`, (err, results) => {
                if(err) reject(err);
                resolve(results);
            });
        });
    }

    /**
     * Create operation
     * @param body 
     * @returns 
     */
    createMail(body:mailInfo): Promise<any>{
        return new Promise((resolve, reject) => {
            //? prevents SQL injection
            connection.query('INSERT INTO mail SET ?', [body], (err, results) => {
                if(err) reject(err);
                resolve(results);
            });
        });
    }

    updateMail(id: number, body:mailInfo):Promise<any>{
        return new Promise((resolve, reject) => {
            connection.query('UPDATE mail SET ? WHERE mail_id = ?', [body, id], (err, results) => {
                if(err) reject(err);
                resolve(results);
            });
        });
    }

    deleteMailById(mail_id:number):Promise<any>{
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM mail WHERE mail_id = ?', [mail_id], (err, results) => {
                if(err) reject(err);
                resolve(results);
            });
        });
    }
}