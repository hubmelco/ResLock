import nodemailer from 'nodemailer';
import bcrpyt from 'bcrypt';
import connection from '../db-service';
import Email from 'email-templates';
import { getTokenTemp } from '../../authentication';
const path = require('path');

const transporter = nodemailer.createTransport({
    service: "Outlook365",
    host: "smtp.office365.com",
    port: "587",
    tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
    },
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

/**
 * Function to send the OTP to the user's email
 * @param toEmail email to send the otp to
 * @returns 
 */
export const sendOTP = async (toEmail: string) => {
    connection.query('DELETE FROM otp WHERE user_email = ?', [toEmail], (err) => {
        if (err) throw err;
    });
    // Make a random 6 digit number
    const min = 10000000;
    const max = 99999999;
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    // Hash the OTP
    // const hashedOTP: string = await bcrpyt.hash(otp.toString(), 10);

    const current_time: Date = new Date();

    // Set the expiration time to 1 hour from now
    const expiration_time = new Date();
    expiration_time.setHours(expiration_time.getHours() + 1);

    // Insert the OTP into the database
    connection.query('INSERT INTO otp values (?, ?, ? ,?)', [toEmail, otp, current_time, expiration_time], (err) => {
        if (err) throw err;
    });

    // Create Email object which uses the nodemailer transporter and checks for handlebars files
    const email: Email = new Email({
        message: {
            from: "ResLock <" + process.env.EMAIL + ">"
        },
        send: true,
        transport: transporter,
        views: {
            options: {
                extension: 'hbs'
            }
        },
        preview: false
    });

    // Create the link with some environemnt variable
    const link = process.env.FRONTEND_URL + "/resetPassword/?otp=" + otp;
    // Send the email with the template in the emails/OTP folder
    return email.send({
        template: path.join(__dirname, 'emails', 'OTP'),
        message: {
            to: toEmail
        },
        locals: {
            link: link
        }
    });
};
/**
 * Function to be used at link click to verify the OTP
 * @param otp The OTP to verify
 * @returns JSON object with a boolean valid and a string message or an email if valid
 */
export const verifyOTP = async (otp: string) => {
    // Get the OTP from the database
    return new Promise<object>((resolve, reject) => {
        connection.query('SELECT * FROM otp WHERE otp = ?', [otp], async (err, result) => {
            if (err) return reject({ valid: false, message: "Error getting OTP" });
            // Check if the OTP exists
            if (Array.isArray(result) && result.length === 0) return reject({ valid: false, message: "OTP Not Found" });
            let toEmail: string = result[0].user_email;
            // Check if the OTP is expired
            const expiration_time: Date = new Date(result[0].expires_at);
            if (expiration_time < new Date()) return reject({ valid: false, message: "OTP Expired" });
            return resolve({ valid: true, email: toEmail });
        });
    });
};

/**
 * Function to set the user's password
 * @param otp to make sure it's still valid without a token 
 * @param password the new users password
 * @returns 
 */
export const setPassword = async (otp: string, password: string) => {
    const hashedPassword: string = await bcrpyt.hash(password, 10);
    // Get the OTP from the database
    return new Promise<object>((resolve, reject) => {
        connection.query('SELECT * FROM otp WHERE otp = ?', [otp], async (err, result) => {
            if (err) return reject({ verified: false, message: "Error getting OTP" });
            // Check if the OTP exists
            if (Array.isArray(result) && result.length === 0) return reject({ verified: false, message: "OTP Not Found" });

            let toEmail: string = result[0].user_email;
            // Check if the OTP is expired
            const expiration_time: Date = new Date(result[0].expires_at);
            if (expiration_time < new Date()) return reject({ verified: false, message: "OTP Expired" });

            // Set the user's password
            connection.query('UPDATE user SET password = ? WHERE email = ?', [hashedPassword, result[0].user_email], (err) => {
                if (err) return reject({ verified: false, message: "Error setting password" });
            });

            // Delete the OTP from the database
            connection.query('DELETE FROM otp WHERE user_email = ?', [toEmail], (err) => {
                if (err) return reject({ verified: false, message: "Error deleting OTP" });
            });
            // Update user's verified and registered status
            connection.query('UPDATE user SET verified = true, registered = true WHERE email = ?', [toEmail], (err) => {
                if (err) return reject({ verified: false, message: "Error Setting User as Verified" });
            });
            return resolve({ verified: true });
        });
    })
};