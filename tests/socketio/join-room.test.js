/* LIBRARIES */

const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

const GAME_EVENTS = require('../../events/game-events');
const GLOBAL_STATE = require('../../global');

describe('Join Room', () => {
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

  test('user joins public room', (done) => {
    const isRoomPrivate = false;
    const user = { username: 'test_user' };

    GAME_EVENTS.createRoomEvent(serverSocket, isRoomPrivate, user);

    const roomCode = Object.keys(GLOBAL_STATE._gameRooms)[0];
    const room = Object.values(GLOBAL_STATE._gameRooms)[0];

    clientSocket.emit('joinRoom', { roomCode, user });

    serverSocket.on('joinRoom', ({ roomCode, user }) => {
      GAME_EVENTS.joinRoomEvent(io, serverSocket, roomCode, user);

      expect(roomCode).toBeDefined();
      expect(room).toBeDefined();

      const roomPlayer = {
        roomCode,
        socketId: serverSocket.id,
        name: user.username,
        isHost: false,
        characterId: undefined,
        isReady: false,
      };

      expect(GLOBAL_STATE._gameSockets[serverSocket.id]).toEqual(roomPlayer);

      const roomPlayers = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets).map(socketId => GLOBAL_STATE._gameSockets[socketId]);

      expect(roomPlayers).toContainEqual(roomPlayer);

      const youtubeData = GLOBAL_STATE._gameRooms[roomCode].youtubeData;

      expect(youtubeData).toBeUndefined();

      const openRooms = Object.fromEntries(Object.entries(GLOBAL_STATE._gameRooms).filter(room => (room[1].isRoomPrivate === isRoomPrivate) && (Object.values(room[1].sockets).length < GLOBAL_STATE.MAX_PLAYERS)));

      const openRoom = {};
      openRoom[roomCode] = room;

      expect(openRooms).toEqual(openRoom);

      done();
    });
  });

  test('user joins private room', (done) => {
    const isRoomPrivate = true;
    const user = { username: 'test_user' };

    GAME_EVENTS.createRoomEvent(serverSocket, isRoomPrivate, user);

    const roomCode = Object.keys(GLOBAL_STATE._gameRooms)[0];
    const room = Object.values(GLOBAL_STATE._gameRooms)[0];

    clientSocket.emit('joinRoom', { roomCode, user });

    serverSocket.on('joinRoom', ({ roomCode, user }) => {
      GAME_EVENTS.joinRoomEvent(io, serverSocket, roomCode, user);

      expect(roomCode).toBeDefined();
      expect(room).toBeDefined();

      const roomPlayer = {
        roomCode,
        socketId: serverSocket.id,
        name: user.username,
        isHost: false,
        characterId: undefined,
        isReady: false,
      };

      expect(GLOBAL_STATE._gameSockets[serverSocket.id]).toEqual(roomPlayer);

      const roomPlayers = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets).map(socketId => GLOBAL_STATE._gameSockets[socketId]);

      expect(roomPlayers).toContainEqual(roomPlayer);

      const youtubeData = GLOBAL_STATE._gameRooms[roomCode].youtubeData;

      expect(youtubeData).toBeUndefined();

      const openRooms = Object.fromEntries(Object.entries(GLOBAL_STATE._gameRooms).filter(room => (room[1].isRoomPrivate === isRoomPrivate) && (Object.values(room[1].sockets).length < GLOBAL_STATE.MAX_PLAYERS)));

      const openRoom = {};
      openRoom[roomCode] = room;

      expect(openRooms).toEqual(openRoom);

      done();
    });
  });
});