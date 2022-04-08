/* LIBRARIES */

const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

const GAME_EVENTS = require('../../events/game-events');
const GLOBAL_STATE = require('../../global');

describe('Leave Room', () => {
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

  test('user leaves public room', (done) => {
    const isRoomPrivate = false;
    const user1 = { username: 'test_user_1' };
    const user2 = { username: 'test_user_2' };

    GAME_EVENTS.createRoomEvent(serverSocket, isRoomPrivate, user1);

    const roomCode = Object.keys(GLOBAL_STATE._gameRooms)[0];
    const room = Object.values(GLOBAL_STATE._gameRooms)[0];

    GAME_EVENTS.joinRoomEvent(io, serverSocket, roomCode, user2);

    const roomPlayer = {
      roomCode,
      socketId: serverSocket.id,
      name: user2.username,
      isHost: false,
      characterId: undefined,
      isReady: false,
    };

    clientSocket.emit('leaveRoom', { roomCode, roomPlayer });

    serverSocket.on('leaveRoom', ({ roomCode, roomPlayer }) => {
      GAME_EVENTS.leaveRoomEvent(io, serverSocket, roomCode, roomPlayer);

      expect(GLOBAL_STATE._gameRooms[roomCode]).toBeUndefined();

      done();
    });
  });

  test('user leaves private room', (done) => {
    const isRoomPrivate = true;
    const user1 = { username: 'test_user_1' };
    const user2 = { username: 'test_user_2' };

    GAME_EVENTS.createRoomEvent(serverSocket, isRoomPrivate, user1);

    const roomCode = Object.keys(GLOBAL_STATE._gameRooms)[0];
    const room = Object.values(GLOBAL_STATE._gameRooms)[0];

    GAME_EVENTS.joinRoomEvent(io, serverSocket, roomCode, user2);

    const roomPlayer = {
      roomCode,
      socketId: serverSocket.id,
      name: user2.username,
      isHost: false,
      characterId: undefined,
      isReady: false,
    };

    clientSocket.emit('leaveRoom', { roomCode, roomPlayer });

    serverSocket.on('leaveRoom', ({ roomCode, roomPlayer }) => {
      GAME_EVENTS.leaveRoomEvent(io, serverSocket, roomCode, roomPlayer);

      expect(GLOBAL_STATE._gameRooms[roomCode]).toBeUndefined();

      done();
    });
  });
});