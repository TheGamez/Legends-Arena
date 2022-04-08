/* UTILS */

const authentication = require('../utils/authentication');

describe('Authentication', () => {
  test('authenticate user', () => {
    const testRequest = {
      session: {
        user: {
          email: 'johndoe@gmail.com',
        },
      },
    };
    const testResponse = {};
    const testNext = () => {};
  
    const isAuth = authentication.isAuthenticated(testRequest, testResponse, testNext);
  
    expect(isAuth).toBeUndefined();
  });
});