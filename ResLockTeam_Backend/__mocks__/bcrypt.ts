const bcrypt = jest.createMockFromModule('bcrypt');

// Custom compare function used to mock the bcrypt compare function
const compare = (input: string, password: string): Promise<boolean> => {
    return Promise.resolve(input === password)
}

bcrypt.compare = compare;

export default bcrypt;