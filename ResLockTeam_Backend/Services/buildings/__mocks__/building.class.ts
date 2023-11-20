// Import this named export into your test file:
const mockCreateBuilding = jest.fn().mockImplementation(async (body) => {
    return Promise.resolve("Building Created");
});

const mockGetBuildingsByID = jest.fn().mockImplementation(async (building_id) => {
    if (building_id == '1') {
        return Promise.resolve([{"org_id" : 1}]);
    } else if (building_id == '2') {
        return Promise.resolve([]);
    } else {
        return Promise.reject("Error finding building");
    }
});
const mockBuildingLookUp = jest.fn().mockImplementation(async ({org_id}) => {
    if (org_id === '1') {
        return Promise.resolve("Buildings Found");
    } else if (org_id === '2') {
        return Promise.resolve([]);
    } else {
        return Promise.reject("Error finding building");
    }
});
const mockUpdateBuildingByID = jest.fn().mockImplementation(async (building_id, building_info) => {
    if (building_id == '1') {
        return Promise.resolve({affectedRows: 1});
    } else if (building_id == '2') {
        return Promise.resolve({affectedRows: 0});
    } else {
        return Promise.reject("Error finding building");
    }
});

const mockDeleteBuildingByID = jest.fn().mockImplementation(async (building_id) => {
    if (building_id == '1') {
        return Promise.resolve({affectedRows: 1});
    } else if (building_id == '2') {
        return Promise.resolve({affectedRows: 0});
    } else {
        return Promise.reject("Error finding building");
    }
});


const mock = jest.fn().mockImplementation(() => {
    return {
        createBuilding: mockCreateBuilding,
        getBuildingById: mockGetBuildingsByID,
        buildingLookUp: mockBuildingLookUp,
        updateBuildingId: mockUpdateBuildingByID,
        deleteBuildingById: mockDeleteBuildingByID
    };
});

export default mock;