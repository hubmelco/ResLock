import mysql from 'mysql2';
import dotenv from 'dotenv';
import Connection from 'mysql2/typings/mysql/lib/Connection';
dotenv.config();


const instance = (() => {
    let connection:Connection;
    const createInstance = () => {
        console.log("Trying to Connect...")
        const port:number= Number(process.env.DB_PORT ?? 3306);
        connection =  mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            port: port,
            multipleStatements: true
        });
        console.log("Connected Successfully");
    }

    return {
        getInstance():Connection {
            if (!connection) {
                createInstance();
            }
            return connection
        }
    }
})();

export default instance.getInstance();
