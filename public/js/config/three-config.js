/* MODULES */

import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.5-HJEdoVYPhjkiJWkt6XIa/mode=imports/optimized/three.js';
import GLOBAL_STATE from '../global.js';

/* VARIABLES */

const BG_COLOR = 0x000000; // black
const SNAKE_COLOR_1 = 0x1E88E5; // blue
const SNAKE_COLOR_2 = 0xFB8C00; // orange
const FOOD_COLOR = 0xE53935; // red

let CANVAS_WIDTH = window.innerWidth; // in pixels
let CANVAS_HEIGHT = window.innerHeight; // in pixels

let scene, camera, renderer;

/* FUNCTIONS */

const initializeGame = () => {
  // creating the scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(BG_COLOR);

  camera = new THREE.PerspectiveCamera(75, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 1000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);

  const rootScreenElement = document.querySelector('#root-screen');
  rootScreenElement.appendChild(renderer.domElement);

  camera.position.z = 5;

  GLOBAL_STATE.isGameActive = true;
}

// Rendering the scene
const animateGame = (gameState) => {
  // first remove any previous mesh objects
  const previousPlayerOneMesh = scene.getObjectByName('playerOneMesh');
  if (previousPlayerOneMesh) {
    scene.remove(previousPlayerOneMesh);
  }

  const previousPlayerTwoMesh = scene.getObjectByName('playerTwoMesh');
  if (previousPlayerTwoMesh) {
    scene.remove(previousPlayerTwoMesh);
  }

  const previousFoodMesh = scene.getObjectByName('foodMesh');
  if (previousFoodMesh) {
    scene.remove(previousFoodMesh);
  }

  const playerOne = gameState.players[0];
  const playerTwo = gameState.players[1];
  const food = gameState.food;

  // then add new mesh objects
  const playerOneGeometry = new THREE.PlaneGeometry(playerOne.size.w, playerOne.size.h);
  const playerOneMaterial = new THREE.MeshBasicMaterial({ color: SNAKE_COLOR_1 });
  const playerOneMesh = new THREE.Mesh(playerOneGeometry, playerOneMaterial);
  playerOneMesh.position.set(playerOne.pos.x, playerOne.pos.y);
  playerOneMesh.name = 'playerOneMesh';
  scene.add(playerOneMesh);

  const playerTwoGeometry = new THREE.PlaneGeometry(playerTwo.size.w, playerTwo.size.h);
  const playerTwoMaterial = new THREE.MeshBasicMaterial({ color: SNAKE_COLOR_2 });
  const playerTwoMesh = new THREE.Mesh(playerTwoGeometry, playerTwoMaterial);
  playerTwoMesh.position.set(playerTwo.pos.x, playerTwo.pos.y);
  playerTwoMesh.name = 'playerTwoMesh';
  scene.add(playerTwoMesh);

  // Adding the food
  const foodGeometry = new THREE.PlaneGeometry(1, 1);
  const foodMaterial = new THREE.MeshBasicMaterial({ color: FOOD_COLOR });
  const foodMesh = new THREE.Mesh(foodGeometry, foodMaterial);
  foodMesh.position.set(food.x, food.y);
  foodMesh.name = 'foodMesh';
  scene.add(foodMesh);

  renderer.render(scene, camera);
};

window.addEventListener('resize', () => {
  if (camera && renderer) {
    // update window size
    CANVAS_WIDTH = window.innerWidth;
    CANVAS_HEIGHT = window.innerHeight;

    // update camera
    camera.aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
    camera.updateProjectionMatrix();

    // update renderer
    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
  }
});

export {
  initializeGame,
  animateGame,
};