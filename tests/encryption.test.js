/* UTILS */

const encryption = require('../utils/encryption');

describe('Password Generation and Validation', () => {
  test('generate and validate password', async () => {
    const testPassword = 'test_password';
  
    const { salt, hash } = await encryption.generatePassword(testPassword);
  
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  
    const isValid = encryption.validatePassword(testPassword, hash, salt);
  
    expect(isValid).toBeTruthy();
  });
});