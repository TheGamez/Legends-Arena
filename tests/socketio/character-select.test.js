/* LIBRARIES */

const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

const GAME_EVENTS = require('../../events/game-events');
const GLOBAL_STATE = require('../../global');

describe('Character Select', () => {
  let io, serverSocket, clientSocket;

  beforeEach((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);

    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on('connection', (socket) => serverSocket = socket);
      clientSocket.on('connect', done);
    });
  });

  afterEach(() => {
    GLOBAL_STATE._gameRooms = {};
    GLOBAL_STATE._gameSockets = {};

    io.close();
    clientSocket.close();
  });

  test('user selects monster character', (done) => {
    const isRoomPrivate = false;
    const user = { username: 'test_user' };
    const characterId = 1;

    GAME_EVENTS.createRoomEvent(serverSocket, isRoomPrivate, user);

    const roomCode = Object.keys(GLOBAL_STATE._gameRooms)[0];

    expect(roomCode).toBeDefined();

    clientSocket.emit('characterSelect', { roomCode, characterId });

    serverSocket.on('characterSelect', ({ roomCode, characterId }) => {

      GAME_EVENTS.characterSelectEvent(io, serverSocket, roomCode, characterId);

      expect(GLOBAL_STATE._gameSockets[serverSocket.id].characterId).toBe(characterId);

      done();
    });
  });

  test('user selects demon character', (done) => {
    const isRoomPrivate = false;
    const user = { username: 'test_user' };
    const characterId = 2;

    GAME_EVENTS.createRoomEvent(serverSocket, isRoomPrivate, user);

    const roomCode = Object.keys(GLOBAL_STATE._gameRooms)[0];

    expect(roomCode).toBeDefined();

    clientSocket.emit('characterSelect', { roomCode, characterId });

    serverSocket.on('characterSelect', ({ roomCode, characterId }) => {

      GAME_EVENTS.characterSelectEvent(io, serverSocket, roomCode, characterId);

      expect(GLOBAL_STATE._gameSockets[serverSocket.id].characterId).toBe(characterId);

      done();
    });
  });

  test('user selects robot character', (done) => {
    const isRoomPrivate = false;
    const user = { username: 'test_user' };
    const characterId = 3;

    GAME_EVENTS.createRoomEvent(serverSocket, isRoomPrivate, user);

    const roomCode = Object.keys(GLOBAL_STATE._gameRooms)[0];

    expect(roomCode).toBeDefined();

    clientSocket.emit('characterSelect', { roomCode, characterId });

    serverSocket.on('characterSelect', ({ roomCode, characterId }) => {

      GAME_EVENTS.characterSelectEvent(io, serverSocket, roomCode, characterId);

      expect(GLOBAL_STATE._gameSockets[serverSocket.id].characterId).toBe(characterId);

      done();
    });
  });
});