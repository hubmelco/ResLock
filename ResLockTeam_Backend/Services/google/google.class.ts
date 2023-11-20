import { buildingInfo } from '../database-types';
import connection from '../db-service';
import mysql from 'mysql2';

export default class Google {

    /**
     * This method returns the access token for a user's google account
     * 
     * @param authCode 
     * @param codeVerifier 
     * @returns 
     */
    async getAccessToken(authCode:string, codeVerifier: string) {
        let authBody = JSON.stringify({
            "client_id": process.env.CLIENT_ID,
            "client_secret": process.env.CLIENT_SECRET,
            "redirect_uri": "https://auth.expo.io/@reslock/reslock",
            "code": authCode,
            "grant_type": "authorization_code",
            "code_verifier": codeVerifier
          })

        let response = await fetch("https://oauth2.googleapis.com/token", {
            body: authBody,
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            redirect: 'follow'
        })

        return await response.json()
    }

    async getGoogleUser(accessToken: string) {

        let info = await fetch("https://www.googleapis.com/userinfo/v2/me", {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
        return await info.json()
    }
}
