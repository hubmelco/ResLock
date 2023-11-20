// Import this named export into your test file:
const mockCreateUser = jest.fn().mockImplementation(async (body) => {
    return Promise.resolve("User Created");
});

const mockGetUserByID = jest.fn().mockImplementation(async (email, org_id) => {
    if (email == '1') {
        return Promise.resolve([{email: '1', password: '1', org_id: 1}]);
    } else if (email == '2') {
        return Promise.resolve([]);
    } else {
        return Promise.reject("Error finding user");
    }
});
const mockGetUsersByParams = jest.fn().mockImplementation(async (query: object) => {
    if (query['test'] == '1') {
        return Promise.resolve([{email: '1', password: '1'}, {email: '2', password: '2'}]);
    } else if (query['test'] == '2') {
        return Promise.resolve([]);
    } else {
        return Promise.reject("Error finding user");
    }
});
const mockUpdateUserByID = jest.fn().mockImplementation(async (email, body) => {
    if (email == '1') {
        return Promise.resolve({affectedRows: 1});
    } else if (email == '2') {
        return Promise.resolve({affectedRows: 0});
    } else {
        return Promise.reject("Error finding user");
    }
});

const mockDeleteUserByID = jest.fn().mockImplementation(async (email) => {
    if (email == '1') {
        return Promise.resolve({affectedRows: 1});
    } else if (email == '2') {
        return Promise.resolve({affectedRows: 0});
    } else {
        return Promise.reject("Error finding user");
    }
});


const mock = jest.fn().mockImplementation(() => {
    return {
        createUser: mockCreateUser,
        getUser: mockGetUserByID,
        userLookUp: mockGetUsersByParams,
        updateUser: mockUpdateUserByID,
        deleteUser: mockDeleteUserByID,
        getUserRestricted: mockGetUserByID
    };
});

export default mock;