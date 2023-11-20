// Import this named export into your test file:
const mockGetAllOrganizations = jest.fn().mockImplementation(async () => {
    return Promise.resolve("Some List of Orgs");
});
const mockGetOrganizationsByID = jest.fn().mockImplementation(async (id) => {
    if(id == '2'){
        return Promise.resolve([]);
    } else if(id == '1'){
        return Promise.resolve("Org with ID");
    } else {
        return Promise.reject("Simulate Error");
    }
});
const mockCreateOrganization = jest.fn().mockImplementation(async (body) => {
    return Promise.resolve("Organization Created");
});
const mockUpdateOrganization = jest.fn().mockImplementation(async (org_id, body) => {
    if(org_id == '1'){
        return Promise.resolve({affectedRows: 1});
    } else{
        return Promise.resolve({affectedRows: 0});
    }
    
});
const mockDeleteOrganization = jest.fn().mockImplementation(async (id) => {
    return Promise.resolve("Organization Deleted");
});


const mock = jest.fn().mockImplementation(() => {
    return {
        getAllOrganizations: mockGetAllOrganizations,
        createOrganization: mockCreateOrganization,
        getOrganizationById: mockGetOrganizationsByID,
        updateOrganization: mockUpdateOrganization,
        deleteOrganizationById: mockDeleteOrganization
    };
});

export default mock;