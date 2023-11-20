type RowDataPacket = import("mysql2").RowDataPacket;
export interface userInfo extends RowDataPacket {
    email: string,
    first_name: string,
    last_name: string,
    password?: string,
    room: number,
    privilege: number,
    org_id: number,
    building_id: number,
    verified: boolean,
    registered: boolean
}

export interface mailInfo extends RowDataPacket {
    mail_id: number,
    date_received: Date,
    date_picked_up: Date,
    is_letter: boolean,
    email: string,
    building_id: number
}

export interface buildingInfo extends RowDataPacket {
    building_id: number,
    org_id: number,
    name: string,
    addr: string
}

export interface organizationInfo extends RowDataPacket {
    org_id: number,
    name: string
}

export interface notificationInfo extends RowDataPacket {
    to_email: string,
    from_email: string,
    type: string,
    content: JSON
}