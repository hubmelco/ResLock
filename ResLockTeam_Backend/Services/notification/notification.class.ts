import mysql from 'mysql2';
import { notificationInfo } from '../database-types';
import connection from '../db-service';

/**
 * Class containing CRUD functions for querying the database
 * @author Roberto Garcia
 */
export default class Notification {
    // Read
    getNotification(email: string): Promise<notificationInfo[]> {
        return new Promise((resolve, reject) => {
            connection.query<notificationInfo[]>('SELECT * FROM notification WHERE to_email = ?', [email], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
    residentGetNotifications(email: string): Promise<notificationInfo[]> {
        return new Promise((resolve, reject) => {
            connection.query<notificationInfo[]>('SELECT * FROM notification WHERE from_email = ?', [email], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
    // Create
    createNotification(headers, content) {
        return new Promise((resolve, reject) => {
            const stringContent = JSON.stringify(content);
            connection.query('INSERT INTO notification SET ?, content = ?', [headers, stringContent], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
    // Update
    updateNotification(id: number, body: notificationInfo) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE notification SET ?, updated_at=CURRENT_TIMESTAMP WHERE id = ?', [body, id], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
    // Delete
    deleteNotificationById(id: number) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM notification WHERE id = ?', [id], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
}