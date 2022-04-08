/* LIBRARIES */

const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

const GAME_EVENTS = require('../../events/game-events');
const GLOBAL_STATE = require('../../global');

describe('Player Ready Status', () => {
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

  test('user clicks player ready', (done) => {
    const isRoomPrivate = false;
    const user = { username: 'test_user' };

    GAME_EVENTS.createRoomEvent(serverSocket, isRoomPrivate, user);

    const roomCode = Object.keys(GLOBAL_STATE._gameRooms)[0];

    expect(roomCode).toBeDefined();

    const roomPlayer = {
      roomCode,
      socketId: serverSocket.id,
      name: user.username,
      isHost: true,
      characterId: undefined,
      isReady: false,
    };

    clientSocket.emit('playerReady', { roomPlayer });

    serverSocket.on('playerReady', ({ roomPlayer }) => {
      GAME_EVENTS.playerReadyEvent(io, serverSocket, roomPlayer);

      expect(GLOBAL_STATE._gameSockets[serverSocket.id].isReady).toBeTruthy();

      done();
    });
  });

  test('user clicks player ready cancel', (done) => {
    const isRoomPrivate = false;
    const user = { username: 'test_user' };

    GAME_EVENTS.createRoomEvent(serverSocket, isRoomPrivate, user);

    const roomCode = Object.keys(GLOBAL_STATE._gameRooms)[0];

    expect(roomCode).toBeDefined();

    const roomPlayer = {
      roomCode,
      socketId: serverSocket.id,
      name: user.username,
      isHost: true,
      characterId: undefined,
      isReady: true,
    };

    clientSocket.emit('playerReadyCancel', { roomPlayer });

    serverSocket.on('playerReadyCancel', ({ roomPlayer }) => {
      GAME_EVENTS.playerReadyCancelEvent(io, serverSocket, roomPlayer);

      expect(GLOBAL_STATE._gameSockets[serverSocket.id].isReady).toBeFalsy();

      done();
    });
  });
});