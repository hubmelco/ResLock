import connection from '../db-service';
import mysql from 'mysql2';

export default class ResidentUpload {

    addUsers(body: any): Promise<any> {
        // Join the values into a string for the query
        const values = body.map(obj => `(${[
            // Escapes to prevent SQL injection
            mysql.escape(obj.first_name),
            mysql.escape(obj.last_name),
            mysql.escape(obj.email),
            mysql.escape(obj.room),
            obj.building_id,
            obj.org_id
        ].join(',')})`).join(',');

        // Insert into the user table
        const query = `INSERT INTO user (first_name, last_name, email, room, building_id, org_id) VALUES ${values}`;


        return new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
}