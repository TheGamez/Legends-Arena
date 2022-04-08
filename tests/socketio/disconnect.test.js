/* LIBRARIES */

const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

const GAME_EVENTS = require('../../events/game-events');
const GLOBAL_STATE = require('../../global');

describe('Disconnect Socket', () => {
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

  test('socket in a room disconnects', (done) => {
    const isRoomPrivate = false;
    const user = { username: 'test_user' };

    GAME_EVENTS.createRoomEvent(serverSocket, isRoomPrivate, user);

    const roomCode = Object.keys(GLOBAL_STATE._gameRooms)[0];

    expect(roomCode).toBeDefined();

    clientSocket.disconnect();

    serverSocket.on('disconnect', () => {

      GAME_EVENTS.disconnectionEvent(io, serverSocket);

      expect(GLOBAL_STATE._gameRooms[roomCode]).toBeUndefined();
      expect(GLOBAL_STATE._gameSockets[serverSocket.id]).toBeUndefined();

      done();
    });
  });

  test('socket not in a room disconnects', (done) => {
    const roomCode = Object.keys(GLOBAL_STATE._gameRooms)[0];

    expect(roomCode).toBeUndefined();

    clientSocket.disconnect();

    serverSocket.on('disconnect', () => {
      GAME_EVENTS.disconnectionEvent(io, serverSocket);

      expect(GLOBAL_STATE._gameSockets[serverSocket.id]).toBeUndefined();

      done();
    });
  });
});