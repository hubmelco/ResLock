// Import this named export into your test file:
const mockGetMailById = jest.fn().mockImplementation(async (mail_id) => {
    if (mail_id == '1') {
        return Promise.resolve([{"email" : "test@test.com"}]);
    } else if (mail_id == '2') {
        return Promise.resolve([]);
    } else {
        return Promise.reject("Error finding letter");
    }
});
const mockGet = jest.fn().mockImplementation(async ({email}) => {
    return Promise.resolve([{"email" : email}]);
});
const mockCreateMail = jest.fn().mockImplementation(async (body) => {
    return Promise.resolve("Letter Created");
});
const mockUpdateMail = jest.fn().mockImplementation(async (mail_id, body) => {
    if (mail_id == '1') {
        return Promise.resolve({affectedRows: 1});
    } else if (mail_id == '2') {
        return Promise.resolve({affectedRows: 0});
    } else {
        return Promise.reject("Error finding Letter");
    }
    
});
const mockDeleteMail = jest.fn().mockImplementation(async (mail_id) => {
    if (mail_id == '1') {
        return Promise.resolve({affectedRows: 1});
    } else if (mail_id == '2') {
        return Promise.resolve({affectedRows: 0});
    } else {
        return Promise.reject("Error finding Letter");
    }
});


const mock = jest.fn().mockImplementation(() => {
    return {
        getMailById: mockGetMailById,
        get : mockGet,       
        createMail: mockCreateMail,
        updateMail: mockUpdateMail,
        deleteMailById: mockDeleteMail
    };
});

export default mock;