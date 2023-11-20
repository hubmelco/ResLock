import connection from '../Services/db-service';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const dataSql = fs.readFileSync("./db-fill/DBFillScript.sql").toString();

connection.query(dataSql);

console.log("Database Populated.")

connection.end();
