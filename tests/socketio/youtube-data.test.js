/* LIBRARIES */

const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

const GAME_EVENTS = require('../../events/game-events');
const GLOBAL_STATE = require('../../global');

describe('YouTube Data', () => {
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

  test('user fetches youtube data', (done) => {
    const isRoomPrivate = false;
    const user = { username: 'test_user' };

    GAME_EVENTS.createRoomEvent(serverSocket, isRoomPrivate, user);

    const roomCode = Object.keys(GLOBAL_STATE._gameRooms)[0];

    expect(roomCode).toBeDefined();

    const youtubeData = {
      youtubeVideoId: '123',
      youtubeSnippetTitle: 'test_video',
      youtubePlaylist: '123',
      youtubeAutoplay: 1,
      youtubeControls: 0,
      youtubeDisableKB: 1,
      youtubeLoop: 1,
    };

    clientSocket.emit('youtubeData', { roomCode, youtubeData });

    serverSocket.on('youtubeData', ({ roomCode, youtubeData }) => {
      GAME_EVENTS.youtubeDataEvent(io, serverSocket, roomCode, youtubeData);

      expect(GLOBAL_STATE._gameRooms[roomCode].youtubeData).toBe(youtubeData);

      done();
    });
  });
});