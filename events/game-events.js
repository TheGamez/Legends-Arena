/* LIBRARIES */

const { v4: uuidv4 } = require('uuid');

/* MODELS */

const GLOBAL_STATE = require('../global');

/* FUNCTIONS */

const createRoomEvent = (socket, isRoomPrivate, user) => {
  const roomCode = uuidv4();

  const gameState = {
    pos: { x: 100, y: 0, z: 100 },
    vel: { x: 0, y: 0 },
    movement: {
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false,
    }
  };

  const sockets = {};
  sockets[socket.id] = { roomGameState: gameState };

  GLOBAL_STATE._gameRooms[roomCode] = { isRoomPrivate, sockets, youtubeData: undefined, kickedSocketIds: [] };

  let roomPlayer = {
    roomCode,
    roomGameState: gameState,
    socketId: socket.id,
    name: `guest_${socket.id}`,
    isHost: true,
    characterId: undefined,
    isReady: false,
  };

  if (user) roomPlayer.name = user.username;

  GLOBAL_STATE._gameSockets[socket.id] = roomPlayer;

  const roomPlayers = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets).map(socketId => GLOBAL_STATE._gameSockets[socketId]);

  socket.join(roomCode);
  socket.emit('renderGameLobbyScreen', { roomCode, roomPlayer, roomPlayers });

  const openRooms = Object.fromEntries(Object.entries(GLOBAL_STATE._gameRooms).filter(room => (room[1].isRoomPrivate === false) && (Object.values(room[1].sockets).length < GLOBAL_STATE.MAX_PLAYERS)));
  socket.broadcast.emit('setOpenRooms', openRooms);
}

const joinRoomEvent = (io, socket, roomCode, user) => {
  const room = GLOBAL_STATE._gameRooms[roomCode];
  if (!room) return socket.emit('roomNotFound', 'Room not found.');

  const roomSocketsCount = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets).length;

  if (roomSocketsCount === 0) return socket.emit('roomEmpty', 'Room is empty.');
  if (roomSocketsCount === GLOBAL_STATE.MAX_PLAYERS) return socket.emit('roomFull', 'Room is full.');

  const isSocketKicked = GLOBAL_STATE._gameRooms[roomCode].kickedSocketIds.find(kickedSocketId => kickedSocketId === socket.id );

  if (isSocketKicked) return socket.emit('roomKicked', 'You were kicked from this room.');

  socket.join(roomCode);

  const gameState = {
    pos: { x: 100, y: 0, z: 100 },
    vel: { x: 0, y: 0 },
    movement: {
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false,
    }
  };

  GLOBAL_STATE._gameRooms[roomCode].sockets[socket.id] = { roomGameState: gameState };

  let roomPlayer = {
    roomCode,
    roomGameState: gameState,
    socketId: socket.id,
    name: `guest_${socket.id}`,
    isHost: false,
    characterId: undefined,
    isReady: false,
  };

  if (user) roomPlayer.name = user.username;

  GLOBAL_STATE._gameSockets[socket.id] = roomPlayer;

  const roomPlayers = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets).map(socketId => GLOBAL_STATE._gameSockets[socketId]);

  const youtubeData = GLOBAL_STATE._gameRooms[roomCode].youtubeData;

  socket.emit('renderGameLobbyScreen', { roomCode, roomPlayer, roomPlayers });
  socket.emit('updateYouTubeVideoScreen', { youtubeData });

  io.to(roomCode).emit('updateGameLobbyScreen', { roomPlayers });

  const openRooms = Object.fromEntries(Object.entries(GLOBAL_STATE._gameRooms).filter(room => (room[1].isRoomPrivate === false) && (Object.values(room[1].sockets).length < GLOBAL_STATE.MAX_PLAYERS)));
  socket.broadcast.emit('setOpenRooms', openRooms);
}

const leaveRoomEvent = (io, socket, roomCode, roomPlayer) => {
  socket.leave(roomCode);
  socket.emit('renderGameMenuScreen');

  delete GLOBAL_STATE._gameRooms[roomCode].sockets[socket.id];
  GLOBAL_STATE._gameSockets[socket.id].roomCode = undefined;
  GLOBAL_STATE._gameSockets[socket.id].characterId = undefined;
  GLOBAL_STATE._gameSockets[socket.id].isReady = false;
  
  const isHost = GLOBAL_STATE._gameSockets[socket.id].isHost;
  if (isHost) {
    const gameRoomSocketIds = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets);

    if (gameRoomSocketIds.length > 0) {
      GLOBAL_STATE._gameSockets[gameRoomSocketIds[0]].isHost = true;
    }

    GLOBAL_STATE._gameSockets[socket.id].isHost = false;

    io.to(gameRoomSocketIds[0]).emit('updateYouTubeSearchScreen', { roomCode });
  }

  const roomPlayers = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets).map(socketId => GLOBAL_STATE._gameSockets[socketId]);

  io.to(roomCode).emit('updateGameLobbyScreen', { roomPlayers });

  const roomSocketsCount = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets).length;
  if (roomSocketsCount === 0) delete GLOBAL_STATE._gameRooms[roomCode];

  const openRooms = Object.fromEntries(Object.entries(GLOBAL_STATE._gameRooms).filter(room => (room[1].isRoomPrivate === false) && (Object.values(room[1].sockets).length < GLOBAL_STATE.MAX_PLAYERS)));
  socket.broadcast.emit('setOpenRooms', openRooms);
}

const disconnectionEvent = (io, socket) => {
  const roomCode = GLOBAL_STATE._gameSockets[socket.id] ? GLOBAL_STATE._gameSockets[socket.id].roomCode : undefined;
  
  let roomPlayers = [];

  if (roomCode) {
    delete GLOBAL_STATE._gameRooms[roomCode].sockets[socket.id];
    GLOBAL_STATE._gameSockets[socket.id].roomCode = undefined;
    GLOBAL_STATE._gameSockets[socket.id].characterId = undefined;
    GLOBAL_STATE._gameSockets[socket.id].isReady = false;

    const isHost = GLOBAL_STATE._gameSockets[socket.id].isHost;
    if (isHost) {
      const gameRoomSocketIds = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets);

      if (gameRoomSocketIds.length > 0) {
        GLOBAL_STATE._gameSockets[gameRoomSocketIds[0]].isHost = true;
      }

      GLOBAL_STATE._gameSockets[socket.id].isHost = false;

      io.to(gameRoomSocketIds[0]).emit('updateYouTubeSearchScreen', { roomCode });
    }

    roomPlayers = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets).map(socketId => GLOBAL_STATE._gameSockets[socketId]);

    io.to(roomCode).emit('updateGameLobbyScreen', { roomPlayers });
  }

  delete GLOBAL_STATE._gameSockets[socket.id];

  if (roomCode) {
    const roomSocketsCount = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets).length;
    if (roomSocketsCount === 0) delete GLOBAL_STATE._gameRooms[roomCode];
  }

  const openRooms = Object.fromEntries(Object.entries(GLOBAL_STATE._gameRooms).filter(room => (room[1].isRoomPrivate === false) && (Object.values(room[1].sockets).length < GLOBAL_STATE.MAX_PLAYERS)));
  socket.broadcast.emit('setOpenRooms', openRooms);
}

const getOpenRoomsEvent = (socket) => {
  const openRooms = Object.fromEntries(Object.entries(GLOBAL_STATE._gameRooms).filter(room => (room[1].isRoomPrivate === false) && (Object.values(room[1].sockets).length < GLOBAL_STATE.MAX_PLAYERS)));
  socket.emit('setOpenRooms', openRooms);
}

const playYoutubeEvent = (io, socket, roomCode, youtubeData) => {
  io.to(roomCode).emit('updateYouTubeVideoScreen', { youtubeData });
}

const youtubeDataEvent = (io, socket, roomCode, youtubeData) => {
  GLOBAL_STATE._gameRooms[roomCode].youtubeData = youtubeData;
}

const characterSelectEvent = (io, socket, roomCode, characterId) => {
  GLOBAL_STATE._gameSockets[socket.id].characterId = characterId;
  socket.emit('updateCharacterSelectScreen', { characterId });
}

const playerReadyEvent = (io, socket, roomPlayer) => {
  GLOBAL_STATE._gameSockets[socket.id].isReady = true;

  const roomPlayers = Object.keys(GLOBAL_STATE._gameRooms[roomPlayer.roomCode].sockets).map(socketId => GLOBAL_STATE._gameSockets[socketId]);

  io.to(roomPlayer.roomCode).emit('updateGameLobbyScreen', { roomPlayers });
}

const playerReadyCancelEvent = (io, socket, roomPlayer) => {
  GLOBAL_STATE._gameSockets[socket.id].isReady = false;

  const roomPlayers = Object.keys(GLOBAL_STATE._gameRooms[roomPlayer.roomCode].sockets).map(socketId => GLOBAL_STATE._gameSockets[socketId]);

  io.to(roomPlayer.roomCode).emit('updateGameLobbyScreen', { roomPlayers });
}

const kickPlayerEvent = (io, socket, roomCode, roomPlayer) => {
  io.to(roomPlayer.socketId).emit('renderGameMenuScreen');

  delete GLOBAL_STATE._gameRooms[roomCode].sockets[roomPlayer.socketId];
  GLOBAL_STATE._gameSockets[roomPlayer.socketId].roomCode = undefined;
  GLOBAL_STATE._gameSockets[roomPlayer.socketId].characterId = undefined;
  GLOBAL_STATE._gameSockets[roomPlayer.socketId].isReady = false;

  GLOBAL_STATE._gameRooms[roomCode].kickedSocketIds.push(roomPlayer.socketId);

  const roomPlayers = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets).map(socketId => GLOBAL_STATE._gameSockets[socketId]);
  io.to(roomCode).emit('updateGameLobbyScreen', { roomPlayers });
}

const startGameInterval = (io, roomCode) => {
  const intervalId = setInterval(() => {
    const room = GLOBAL_STATE._gameRooms[roomCode];

    if (room) {
      const roomPlayers = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets).map(socketId => GLOBAL_STATE._gameSockets[socketId]);
  
      /* TODO: determine winner and losers and handle gameOver outcome */
      const winner = false;
  
      if (!winner) {
        io.to(roomCode).emit('roomGameState', { roomPlayers });
      } else {
        io.to(roomCode).emit('roomGameOver');
        clearInterval(intervalId);
      }
    }
  }, 1000 / GLOBAL_STATE.FRAME_RATE); // FPS
}

const startGameEvent = (io, socket, roomCode) => {
  const roomPlayers = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets).map(socketId => GLOBAL_STATE._gameSockets[socketId]);
  io.to(roomCode).emit('renderGameScreen', { roomPlayers });
  // startGameInterval(io, roomCode);
}

const getUpdatedVelocityDown = (keyInputCode) => {
  // switch (keyInputCode) {
  //   case 'ArrowUp': {
  //     return { x: 0, y: 1, z: 0 };
  //   }
  //   case 'ArrowDown': {
  //     return { x: 0, y: -1, z: 0 };
  //   }
  //   case 'ArrowLeft': {
  //     return { x: -1, y: 0, z: 0 };
  //   }
  //   case 'ArrowRight': {
  //     return { x: 1, y: 0, z: 0 };
  //   }
  //   default:
  //     return { x: 0, y: 0, z: 0 };
  // }

  switch (keyInputCode) {
    case 'KeyW':
        return { moveForward: true };
    case 'KeyA':
        return { moveLeft: true };
    case 'KeyS':
        return { moveBackward: true };
    case 'KeyD':
        return { moveRight: true };
  }
}

const getUpdatedVelocityUp = (keyInputCode) => {
  // switch (keyInputCode) {
  //   case 'ArrowUp': {
  //     return { x: 0, y: 1, z: 0 };
  //   }
  //   case 'ArrowDown': {
  //     return { x: 0, y: -1, z: 0 };
  //   }
  //   case 'ArrowLeft': {
  //     return { x: -1, y: 0, z: 0 };
  //   }
  //   case 'ArrowRight': {
  //     return { x: 1, y: 0, z: 0 };
  //   }
  //   default:
  //     return { x: 0, y: 0, z: 0 };
  // }

  switch (keyInputCode) {
    case 'KeyW':
        return { moveForward: false };
    case 'KeyA':
        return { moveLeft: false };
    case 'KeyS':
        return { moveBackward: false };
    case 'KeyD':
        return { moveRight: false };
  }
}

const keyDownEvent = (io, socket, keyInputCode) => {

  console.log(socket.id, keyInputCode);

  const velocity = getUpdatedVelocityDown(keyInputCode);

  if (velocity) {
    if (velocity.moveForward) GLOBAL_STATE._gameSockets[socket.id].roomGameState.movement.moveForward = velocity.moveForward;
    if (velocity.moveBackward) GLOBAL_STATE._gameSockets[socket.id].roomGameState.movement.moveBackward = velocity.moveBackward;
    if (velocity.moveLeft) GLOBAL_STATE._gameSockets[socket.id].roomGameState.movement.moveLeft = velocity.moveLeft;
    if (velocity.moveRight) GLOBAL_STATE._gameSockets[socket.id].roomGameState.movement.moveRight = velocity.moveRight;
  }

  const roomCode = GLOBAL_STATE._gameSockets[socket.id].roomCode;
  const roomPlayers = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets).map(socketId => GLOBAL_STATE._gameSockets[socketId]);

  io.to(roomCode).emit('roomGameState', { roomPlayers });
}

const keyUpEvent = (io, socket, keyInputCode) => {

  console.log(socket.id, keyInputCode);

  const velocity = getUpdatedVelocityUp(keyInputCode);

  if (velocity) {
    if (velocity.moveForward) GLOBAL_STATE._gameSockets[socket.id].roomGameState.movement.moveForward = velocity.moveForward;
    if (velocity.moveBackward) GLOBAL_STATE._gameSockets[socket.id].roomGameState.movement.moveBackward = velocity.moveBackward;
    if (velocity.moveLeft) GLOBAL_STATE._gameSockets[socket.id].roomGameState.movement.moveLeft = velocity.moveLeft;
    if (velocity.moveRight) GLOBAL_STATE._gameSockets[socket.id].roomGameState.movement.moveRight = velocity.moveRight;
  }

  const roomCode = GLOBAL_STATE._gameSockets[socket.id].roomCode;
  const roomPlayers = Object.keys(GLOBAL_STATE._gameRooms[roomCode].sockets).map(socketId => GLOBAL_STATE._gameSockets[socketId]);

  io.to(roomCode).emit('roomGameState', { roomPlayers });
}

module.exports = {
  disconnectionEvent,
  createRoomEvent,
  joinRoomEvent,
  leaveRoomEvent,
  getOpenRoomsEvent,
  playYoutubeEvent,
  youtubeDataEvent,
  characterSelectEvent,
  playerReadyEvent,
  playerReadyCancelEvent,
  kickPlayerEvent,
  startGameEvent,
  keyDownEvent,
  keyUpEvent,
};