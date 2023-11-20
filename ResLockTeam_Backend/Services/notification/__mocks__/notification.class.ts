// Import this named export into your test file:
const mockCreateNotification = jest.fn().mockImplementation(async (headers, content) => {
    return Promise.resolve("Notification Created");
});

const mockGetNotification = jest.fn().mockImplementation(async (email) => {
    return Promise.resolve([{ email: '1', password: '1', org_id: 1 }]);
});

const mockUpdateNotificationByID = jest.fn().mockImplementation(async (id, body) => {
    if (id == '1') {
        return Promise.resolve({ affectedRows: 1 });
    } else if (id == '2') {
        return Promise.resolve({ affectedRows: 0 });
    } else {
        return Promise.reject("Error finding notification");
    }
});

const mockDeleteNotificationByID = jest.fn().mockImplementation(async (email) => {
    if (email == '1') {
        return Promise.resolve({ affectedRows: 1 });
    } else if (email == '2') {
        return Promise.resolve({ affectedRows: 0 });
    } else {
        return Promise.reject("Error finding notification");
    }
});


const mock = jest.fn().mockImplementation(() => {
    return {
        createNotification: mockCreateNotification,
        getNotification: mockGetNotification,
        updateNotification: mockUpdateNotificationByID,
        deleteNotificationById: mockDeleteNotificationByID,
    };
});

export default mock;