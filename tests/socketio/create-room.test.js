/* LIBRARIES */

const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

const GAME_EVENTS = require('../../events/game-events');
const GLOBAL_STATE = require('../../global');

describe('Create Room', () => {
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

  test('guest user creates public room', (done) => {
    const isRoomPrivate = false;
    const user = { username: 'guest_test_user' };

    clientSocket.emit('createRoom', { isRoomPrivate, user });

    serverSocket.on('createRoom', ({ isRoomPrivate, user }) => {
      GAME_EVENTS.createRoomEvent(serverSocket, isRoomPrivate, user);

      const roomCode = Object.keys(GLOBAL_STATE._gameRooms)[0];
      const room = Object.values(GLOBAL_STATE._gameRooms)[0];

      expect(roomCode).toBeDefined();
      expect(room).toBeDefined();

      const sockets = {};
      sockets[serverSocket.id] = roomCode;

      expect(room.sockets).toEqual(sockets);
      expect(room.isRoomPrivate).toBeFalsy();
      expect(room.youtubeData).toBeUndefined();
      expect(room.kickedSocketIds).toEqual([]);

      const roomPlayer = {
        roomCode,
        socketId: serverSocket.id,
        name: user.username,
        isHost: true,
        characterId: undefined,
        isReady: false,
      };

      expect(GLOBAL_STATE._gameSockets[serverSocket.id]).toEqual(roomPlayer);

      const roomPlayers = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets).map(socketId => GLOBAL_STATE._gameSockets[socketId]);

      expect(roomPlayers).toContainEqual(roomPlayer);

      const openRooms = Object.fromEntries(Object.entries(GLOBAL_STATE._gameRooms).filter(room => (room[1].isRoomPrivate === isRoomPrivate) && (Object.values(room[1].sockets).length < GLOBAL_STATE.MAX_PLAYERS)));

      const openRoom = {};
      openRoom[roomCode] = room;

      expect(openRooms).toEqual(openRoom);

      done();
    });
  });

  test('guest user creates private room', (done) => {
    const isRoomPrivate = true;
    const user = { username: 'guest_test_user' };

    clientSocket.emit('createRoom', { isRoomPrivate, user });

    serverSocket.on('createRoom', ({ isRoomPrivate, user }) => {
      GAME_EVENTS.createRoomEvent(serverSocket, isRoomPrivate, user);

      const roomCode = Object.keys(GLOBAL_STATE._gameRooms)[0];
      const room = Object.values(GLOBAL_STATE._gameRooms)[0];

      expect(roomCode).toBeDefined();
      expect(room).toBeDefined();

      const sockets = {};
      sockets[serverSocket.id] = roomCode;

      expect(room.sockets).toEqual(sockets);
      expect(room.isRoomPrivate).toBeTruthy();
      expect(room.youtubeData).toBeUndefined();
      expect(room.kickedSocketIds).toEqual([]);

      const roomPlayer = {
        roomCode,
        socketId: serverSocket.id,
        name: user.username,
        isHost: true,
        characterId: undefined,
        isReady: false,
      };

      expect(GLOBAL_STATE._gameSockets[serverSocket.id]).toEqual(roomPlayer);

      const roomPlayers = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets).map(socketId => GLOBAL_STATE._gameSockets[socketId]);

      expect(roomPlayers).toContainEqual(roomPlayer);

      const openRooms = Object.fromEntries(Object.entries(GLOBAL_STATE._gameRooms).filter(room => (room[1].isRoomPrivate === isRoomPrivate) && (Object.values(room[1].sockets).length < GLOBAL_STATE.MAX_PLAYERS)));

      const openRoom = {};
      openRoom[roomCode] = room;

      expect(openRooms).toEqual(openRoom);

      done();
    });
  });

  test('auth user creates public room', (done) => {
    const isRoomPrivate = false;
    const user = { username: 'auth_test_user' };

    clientSocket.emit('createRoom', { isRoomPrivate, user });

    serverSocket.on('createRoom', ({ isRoomPrivate, user }) => {
      GAME_EVENTS.createRoomEvent(serverSocket, isRoomPrivate, user);

      const roomCode = Object.keys(GLOBAL_STATE._gameRooms)[0];
      const room = Object.values(GLOBAL_STATE._gameRooms)[0];

      expect(roomCode).toBeDefined();
      expect(room).toBeDefined();

      const sockets = {};
      sockets[serverSocket.id] = roomCode;

      expect(room.sockets).toEqual(sockets);
      expect(room.isRoomPrivate).toBeFalsy();
      expect(room.youtubeData).toBeUndefined();
      expect(room.kickedSocketIds).toEqual([]);

      const roomPlayer = {
        roomCode,
        socketId: serverSocket.id,
        name: user.username,
        isHost: true,
        characterId: undefined,
        isReady: false,
      };

      expect(GLOBAL_STATE._gameSockets[serverSocket.id]).toEqual(roomPlayer);

      const roomPlayers = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets).map(socketId => GLOBAL_STATE._gameSockets[socketId]);

      expect(roomPlayers).toContainEqual(roomPlayer);

      const openRooms = Object.fromEntries(Object.entries(GLOBAL_STATE._gameRooms).filter(room => (room[1].isRoomPrivate === isRoomPrivate) && (Object.values(room[1].sockets).length < GLOBAL_STATE.MAX_PLAYERS)));

      const openRoom = {};
      openRoom[roomCode] = room;

      expect(openRooms).toEqual(openRoom);

      done();
    });
  });

  test('auth user creates private room', (done) => {
    const isRoomPrivate = true;
    const user = { username: 'auth_test_user' };

    clientSocket.emit('createRoom', { isRoomPrivate, user });

    serverSocket.on('createRoom', ({ isRoomPrivate, user }) => {
      GAME_EVENTS.createRoomEvent(serverSocket, isRoomPrivate, user);

      const roomCode = Object.keys(GLOBAL_STATE._gameRooms)[0];
      const room = Object.values(GLOBAL_STATE._gameRooms)[0];

      expect(roomCode).toBeDefined();
      expect(room).toBeDefined();

      const sockets = {};
      sockets[serverSocket.id] = roomCode;

      expect(room.sockets).toEqual(sockets);
      expect(room.isRoomPrivate).toBeTruthy();
      expect(room.youtubeData).toBeUndefined();
      expect(room.kickedSocketIds).toEqual([]);

      const roomPlayer = {
        roomCode,
        socketId: serverSocket.id,
        name: user.username,
        isHost: true,
        characterId: undefined,
        isReady: false,
      };

      expect(GLOBAL_STATE._gameSockets[serverSocket.id]).toEqual(roomPlayer);

      const roomPlayers = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets).map(socketId => GLOBAL_STATE._gameSockets[socketId]);

      expect(roomPlayers).toContainEqual(roomPlayer);

      const openRooms = Object.fromEntries(Object.entries(GLOBAL_STATE._gameRooms).filter(room => (room[1].isRoomPrivate === isRoomPrivate) && (Object.values(room[1].sockets).length < GLOBAL_STATE.MAX_PLAYERS)));

      const openRoom = {};
      openRoom[roomCode] = room;

      expect(openRooms).toEqual(openRoom);

      done();
    });
  });
});