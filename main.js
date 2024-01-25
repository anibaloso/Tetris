import './style.css'


//! inicializamos el canvas
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const $score = document.querySelector('span')
//! tamaño de los bloques de cuantos pixels
const BLOCK_SIZE = 20

//! cantidad de piezas pueden ir en horizontal
const BOARD_WIDTH = 14


//! y en vertical
const BOARD_HEIGHT = 30

//! PUNTUACION
let score = 0

//! tablero del tetris
canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT


//! con este contexto vamos a escalar para que cada punto de nuestro canvas utilice el block_size tanto la x como la y
context.scale(BLOCK_SIZE, BLOCK_SIZE)

//!colores para las piezas
const pieceColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'cyan'];

//BOARD

const board = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

//pieza jugador
const piece = {
  position: { x: 5, y: 5 },
  shape: [
    [1, 1],
    [1, 1]
  ]
}

//! piezas random
const pieces = [
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1, 1, 1, 1]
  ],
  [
    [0, 1, 1],
    [1, 1, 0]
  ],
  [
    [1, 1, 1],
    [0, 1, 0]
  ],
  [
    [0, 1],
    [0, 1],
    [1, 1]
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
]

/*
GAME LOOP 
function update() {
draw()
window.requestAnimationFrame(update)
}*/
let dropCounter = 0
let lastTime = 0

function update(time = 0) {
  const deltaTime = time - lastTime
  lastTime = time

  dropCounter += deltaTime

  if (dropCounter > 1000) {
    piece.position.y++
    dropCounter = 0

    if (checkCollision()) {
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }
  draw()
  window.requestAnimationFrame(update)
}

//dibujamos y coloreamos el tetris
function draw() {
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value == 1) {
        context.fillStyle = 'yellow'
        context.fillRect(x, y, 1, 1)
        drawSquareBorder(x, y);
      }
    })
  })

  // Almacena el color antes de rotar
  const pieceColor = piece.color

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        // Asigna color basado en el tipo de pieza
        context.fillStyle = 'red'
        //cambiar
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)
        drawSquareBorder(x + piece.position.x, y + piece.position.y);
      }
    })
  })

  $score.innerText = score
}

document.addEventListener('keydown', event => {
  if (event.key == 'ArrowLeft') {
    piece.position.x--
    if (checkCollision()) {
      piece.position.x++
    }
  }

  if (event.key == 'ArrowRight') {
    piece.position.x++
    if (checkCollision()) {
      piece.position.x--
    }
  }
  if (event.key == 'ArrowDown') {
    piece.position.y++
    if (checkCollision()) {
      piece.position.y--
      solidifyPiece()
    }
  }

  if (event.key == 'ArrowUp') {
    const rotated = []
    for (let i = 0; i < piece.shape[0].length; i++) {
      const row = []
      for (let j = piece.shape.length - 1; j >= 0; j--) {
        row.push(piece.shape[j][i])
      }
      rotated.push(row)
    }
    const previousShape = piece.shape
    const previousColor = piece.color

    piece.shape = rotated
    if (checkCollision()) {
      piece.shape = previousShape
    }
  }


})

//crear funcion para coliciones
function checkCollision() {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value != 0 &&
        board[y + piece.position.y]?.[x + piece.position.x] != 0
      )
    })
  })
}

function solidifyPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value == 1) {
        board[y + piece.position.y][x + piece.position.x] = 1
        removeRows()
      }
    })
  })

  // Obtén el elemento de audio
  const collisionSound = document.getElementById('collisionSound');
  const newCollisionSound = new Audio(collisionSound.src);

  // Reproduce el sonido
  newCollisionSound.play();

  //! get random shape
  piece.shape = pieces[Math.floor(Math.random() * pieces.length)]


  //! reset position
  piece.position.x = Math.floor(BOARD_WIDTH / 2 - 2)
  piece.position.y = 0

  //! GAME OVER
  if (checkCollision()) {
    window.alert('GAME OVER!!')
    board.forEach((row) => row.fill(0))
  }
}

function removeRows() {
  const rowsToRemove = []

  board.forEach((row, y) => {
    if (row.every(value => value == 1)) {
      rowsToRemove.push(y)
    }
  })

  rowsToRemove.forEach(y => {
    board.splice(y, 1)
    const newRow = Array(BOARD_WIDTH).fill(0)
    board.unshift(newRow)
    score += 100
  })
}

// función para dibujar el borde alrededor de cada cuadrado
function drawSquareBorder(x, y) {
  context.strokeStyle = 'black'; // color del borde (puedes ajustar según tus preferencias)
  context.lineWidth = 0.05; // grosor del borde (ajusta según tus preferencias)
  context.strokeRect(x, y, 1, 1);
}

// function rotatePiece() {
//   // Copia la forma actual de la pieza
//   const originalShape = piece.shape.map(row => [...row])

//   // Transpone la forma de la pieza (intercambia filas por columnas)
//   piece.shape = piece.shape[0].map((_, i) => piece.shape.map(row[i]))

//   // Invierte el orden de las columnas para simular una rotación en sentido horario
//   piece.shape.forEach(row => row.reverse())

//   //verificar colicion despues de la vuelta
//   if (checkCollision()) {
//     //si hay se devuelve a la forma original
//     piece.shape = originalShape
//   }

// }



update()

