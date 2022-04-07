// libraries
require('dotenv').config();

const path = require('path');
const http = require('http');
const express = require('express');
const expressSession = require('express-session');
const pgSession = require('connect-pg-simple')(expressSession);
const { Server } = require('socket.io');

// config
const pool = require('./config/pg');

// routes
const authenticationRoutes = require('./routes/authentication-routes');
const userRoutes = require('./routes/user-routes');

// events
const GAME_EVENTS = require('./events/game-events');

// constants
const PORT = process.env.PORT || 8000;

// server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// app - client
app.use(express.static(path.join(__dirname, '/app/build')));

// app - middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app - session
app.use(expressSession({
  store: new pgSession({ pool, createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 },
}));

// app - routes
app.use('/authentication', authenticationRoutes);
app.use('/users', userRoutes);

// app - server
server.listen(PORT, () => console.log(`[SERVER] http://localhost:${PORT}`));

// app - game
io.on('connect', (socket) => {
  socket.on('disconnect', () => GAME_EVENTS.disconnectionEvent(io, socket));
  socket.on('createRoom', ({ isRoomPrivate, user }) => GAME_EVENTS.createRoomEvent(socket, isRoomPrivate, user));
  socket.on('joinRoom', ({ roomCode, user }) => GAME_EVENTS.joinRoomEvent(io, socket, roomCode, user));
  socket.on('leaveRoom', ({ roomCode, roomPlayer }) => GAME_EVENTS.leaveRoomEvent(io, socket, roomCode, roomPlayer));
  socket.on('getOpenRooms', () => GAME_EVENTS.getOpenRoomsEvent(socket));
  socket.on('playYoutube', ({ roomCode, youtubeData }) => GAME_EVENTS.playYoutubeEvent(io, socket, roomCode, youtubeData));
  socket.on('youtubeData', ({ roomCode, youtubeData }) => GAME_EVENTS.youtubeDataEvent(io, socket, roomCode, youtubeData));
  socket.on('characterSelect', ({ roomCode, characterId }) => GAME_EVENTS.characterSelectEvent(io, socket, roomCode, characterId));
  socket.on('playerReady', ({ roomPlayer }) => GAME_EVENTS.playerReadyEvent(io, socket, roomPlayer));
  socket.on('playerReadyCancel', ({ roomPlayer }) => GAME_EVENTS.playerReadyCancelEvent(io, socket, roomPlayer));
  socket.on('kickPlayer', ({ roomCode, roomPlayer }) => GAME_EVENTS.kickPlayerEvent(io, socket, roomCode, roomPlayer));
  socket.on('startGame', ({ roomCode }) => GAME_EVENTS.startGameEvent(io, socket, roomCode));
  socket.on('keydown', ({ keyInputCode }) => GAME_EVENTS.keyDownEvent(io, socket, keyInputCode));
  socket.on('keyup', ({ keyInputCode }) => GAME_EVENTS.keyUpEvent(io, socket, keyInputCode));
});