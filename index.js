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
const connectToGame = require('./config/game');

// routes
const authenticationRoutes = require('./routes/authentication-routes');
const userRoutes = require('./routes/user-routes');

// constants
const PORT = process.env.PORT || 8000;

// server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// app - client
app.use(express.static(path.join(__dirname, 'public')));

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
app.use('/user', userRoutes);

// app - server
server.listen(PORT, () => console.log(`[SERVER] http://localhost:${PORT}`));

// app - game
connectToGame(io);