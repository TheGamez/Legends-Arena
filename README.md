# Legend's Arena

## Proposal Iteration 0: Overview

### Abstract
Legends Arena is an online multiplayer web game that allows users to play together by fighting each other until one is crowned the winner. Users first sign up or log in to an existing account before entering the game’s main menu. Users are able to customize their own game settings, view the game leaderboards, and play the free-for-all fighting game with up to 4 players. The game’s features include the ability to create/join game rooms, customize user settings, play the game by moving up/down/left/right, jumping, punching, and using a special ability, and earn points to move up the game leaderboards. When playing the game, users will be able to choose from a selection of characters before starting. The purpose of this game is to offer a free and entertaining alternative to other fighting games that can be enjoyed by all audiences. Anyone who may be bored, stressed, or is looking for a better fighting game can have some action fun with Legends Arena!

### Project Repository
URL: https://github.com/TheGamez/Legends-Arena

### Scope & Features
#### Feature #1: Multiplayer
- Users can create/join rooms, where a minimum of 2 players and maximum of 4 players can play together.

#### Feature #2: Game Mechanics
- Users can move up/down/left/right, jump, punch, and activate a special ability.

#### Feature #3: Leaderboard
- Users can earn points by winning fights to move up the leaderboard rankings.

#### Feature #4: Game 3D Graphics/Audio
- The game will be made using a 3D engine and incorporate sound effects and music to enhance the game experience.

#### Feature #5: Gameplay 
- The gameplay consists of a multiplayer free-for-all fighting system. The characters will be fighting each other and can also activate a special ability. The main game objective is to defeat opponents until the last one is standing. The idea we are approaching is to have 3 rounds, where each player would pick 2 ability cards that would increase a specific feature in the game (increase damage output, increase health, increase speed, etc). This would make the game more dynamic and intense.

#### Feature #6: Game Characters
- The 4 characters have an overall stylized, comic book look. Each one will consist of a unique special ability. All characters will have stand, fighting, and movement animations. If time permits, we can add audible catchphrases.

#### Feature #7: Game Map(s)
- Users will fight in 1, or if time permits, 2 distinct maps. Each map will have a unique style and contain props users can interact with.

#### Map Inspiration: Camera Angle, Layout/Size, Different Themes
![](https://user-images.githubusercontent.com/29154540/154877666-138e13e5-baf5-46fd-be4e-758e0b88786d.jpg)

## App Technology
### Version Control: 
- GitHub: Source code and version manager

### UI/UX Design:
- Figma: Platform for UI/UX design and prototyping

### Front-end: 
- HTML, CSS: Graphical User Interface
- JavaScript: Game logic
- Three.js/WebGL API: Game renderer
- Socket.io: Real time, bi-directional communication from client to server
- GamePad API: Controller input remapping

### Back-end:
- Node.js: JavaScript run-time
- Socket.io: Real time, bi-directional communication from server to client
- PostgreSQL: SQL database
- Passport.js: Web application authentication

### Libraries/APIs:
#### Three.js/WebGL API: 3D Graphics Engine
- https://threejs.org/
- https://github.com/mrdoob/three.js/
- https://developer.mozilla.org/en-US/docs/Web/API/WebGL_AP
#### Socket.io: Real time, bi-directional communication between web clients and servers
- https://socket.io/
#### Passport.js: Authentication middleware for Node.js
- https://www.passportjs.org/
#### GamePad API: Controller input remapping
- https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API

### REST API:
#### Discord API: Integrate Discord features into the game
- https://discord.com/developers/docs/reference 
- https://discord.com/developers/docs/intro
#### Twitch API: Integrate Twitch features into the game
- https://dev.twitch.tv/docs/api/

### Host:
#### Heroku: Platform for hosting the game

## App Architecture

### User Story: John Doe
  John opens the game and is presented with a login/signup screen. He is prompted to enter a username/password to log in to the game. After logging in, John is presented with the main menu screen. But before playing the game, John can customize his controls to his liking or keep them as default, and use either keyboard and mouse or gamepad controller to play. Now, John can join one of the available lobbies. After joining a lobby, John can select a character that is displayed. Once all the players in the lobby have selected their characters, the game will begin.

  At this point John is now playing the game. John can move left, right, up, down, jump, punch, and use a special ability to take down his opponents. John can also explore the game map and interact with the environment, using it to his advantage. In the game, John has 3 lives and his goal is to be the last one standing/beat the other players to win the game. In each round (3 rounds total), each player would pick 2 ability cards that would increase a specific feature in the game (increase damage output, increase health, increase speed, etc). If John loses all his lives, he is eliminated from the game, or if he is the last one standing, he wins the game.

  After the game is completed, leaderboard stats will be updated for each user profile based on how each player performed in the game. John can now remain in the same lobby or return to the lobby screen to join a new lobby. Otherwise, if John is satisfied for the day, he can exit the game.

### Team Communication & Project Organization
We will hold our online meetings using either Discord or Zoom. We will also communicate via WhatsApp.

We will create and track the progress of the project stories by using GitHub projects. We will have “back-log”, “in-progress”, “testing”, and “done” sections to help organize the stories.

## Game Inspiration

### Super Smash Bros: Gameplay
![](https://user-images.githubusercontent.com/29154540/154879482-58a7f8f3-ea22-440e-beb7-6970b7ce0858.png)


### Ratchet and Clank: Graphics
![](https://user-images.githubusercontent.com/29154540/154879593-f4997e3c-b389-4e37-bfd2-88e285b71eb7.jpg)


