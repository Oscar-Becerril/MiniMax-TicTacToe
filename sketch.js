let tablero = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

let w; 
let h; 

let ai = 'X';
let jugador = 'O';
let currentPlayer = jugador;

function setup() {
  createCanvas(400, 400);
  w = width / 3;
  h = height / 3;
  mejorMovida();
}


function tresIguales(a, b, c) {
  return (a == b && b == c && a != '');
}

function verificarGanador() {
  let ganador = null;

  // horizontal
  for (let i = 0; i < 3; i++) {
    if (tresIguales(tablero[i][0], tablero[i][1], tablero[i][2])) {
      ganador = tablero[i][0];
    }
  }

  // Vertical
  for (let i = 0; i < 3; i++) {
    if (tresIguales(tablero[0][i], tablero[1][i], tablero[2][i])) {
      ganador = tablero[0][i];
    }
  }

  // Diagonal
  if (tresIguales(tablero[0][0], tablero[1][1], tablero[2][2])) {
    ganador = tablero[0][0];
  }
  if (tresIguales(tablero[2][0], tablero[1][1], tablero[0][2])) {
    ganador = tablero[2][0];
  }

  let posicionesVacias = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (tablero[i][j] == '') {
        posicionesVacias++;
      }
    }
  }

  if (ganador == null && posicionesVacias == 0) {
    return 'empate';
  } else {
    return ganador;
  }
}

function mousePressed() {
  if (currentPlayer == jugador) {
    // jugador make turn
    let i = floor(mouseX / w);
    let j = floor(mouseY / h);
    // If valid turn
    if (tablero[i][j] == '') {
      tablero[i][j] = jugador;
      currentPlayer = ai;
      mejorMovida();
    }
  }
}

function draw() {
  

  background(255);
  strokeWeight(4);

  //height = altura total canvas
  //width = ancho total canvas
  line(w, 0, w, height);
  line(w * 2, 0, w * 2, height);
  line(0, h, width, h);
  line(0, h * 2, width, h * 2);

  // dibujo por celda
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      let x = w * i + w / 2;
      let y = h * j + h / 2;
      let spot = tablero[i][j];
      textSize(32);
      let r = w / 4;
      // tipo de simbolo segun jugdor
      if (spot == jugador) {
        // dibujo circulo - jugador
        noFill();
        ellipse(x, y, r * 2);
      } else if (spot == ai) {
        // dibujo cruz - ai
        line(x - r, y - r, x + r, y + r);
        line(x + r, y - r, x - r, y + r);
      }
    }
  }

  let resultado = verificarGanador();
  if (resultado != null) {
    noLoop();
    let mensaje = createP('');
    mensaje.style('font-size', '42pt');
    if (resultado == 'empate') {
      mensaje.html('Empate!');
    } else {
      mensaje.html(`El jugador ${resultado} Gana!`);
    }
  }


}


function mejorMovida() {
  // AI to make its turn
  let mejorValor = -Infinity;
  let move;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // Is the spot available?
      if (tablero[i][j] == '') {
        tablero[i][j] = ai;
        let punto = minimax(tablero, 0, false);
        tablero[i][j] = '';
        if (punto > mejorValor) {
          mejorValor = punto;
          move = { i, j };
        }
      }
    }
  }
  tablero[move.i][move.j] = ai;
  currentPlayer = jugador;
}

let puntos = {
  empate: 0,
  O: -10,
  X: 10
    
};

/*Funcion minimax,
      tablero: contiene las posiciones y simbolo de cada celda
      
*/
function minimax(tablero, ronda, isMaximizing) {
  let resultado = verificarGanador();
  if (resultado !== null) {
    return puntos[resultado];
  }

  if (isMaximizing) {
    let mejorValor = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (tablero[i][j] == '') {
          tablero[i][j] = ai;
          let punto = minimax(tablero, ronda + 1, false);
          tablero[i][j] = '';
          mejorValor = max(punto, mejorValor);
        }
      }
    }
    return mejorValor;
  } else {
    let mejorValor = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (tablero[i][j] == '') {
          tablero[i][j] = jugador;
          let valor = minimax(tablero, ronda + 1, true);
          tablero[i][j] = '';
          mejorValor = min(valor, mejorValor);
        }
      }
    }
    return mejorValor;
  }
}