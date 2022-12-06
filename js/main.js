const boxes = document.querySelectorAll(".box");
const clearBtn = document.getElementById("clear");
const computer = document.getElementById("computer");
const modal = document.getElementById("modal");
const winLabel = document.getElementById("winner");
const again = document.getElementById("again");
const close = document.getElementById("close");
const dificultySlider = document.getElementById("dificulty");
const dificultyLabel = document.getElementById("dificulty-label");
var map = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var singlePlayer = computer.checked;
var dificulty = dificultySlider.value;
var running = true;
var turn = 0;

computer.addEventListener("change", () => {
  if (computer.checked) {
    singlePlayer = true;
  } else {
    singlePlayer = false;
  }
  clear();
});

dificultySlider.addEventListener("change", () => {
  if (turn <= 0) {
    if (dificultySlider.value === "1") {
      dificultyLabel.innerHTML = "Computer Dificulty: Easy";
    } else if (dificultySlider.value === "3") {
      dificultyLabel.innerHTML = "Computer Dificulty: Hard";
    } else {
      dificultyLabel.innerHTML = "Computer Dificulty: Normal";
    }
    dificulty = dificultySlider.value;
  } else {
    dificultySlider.value = dificulty;
  }
});

close.addEventListener("click", () => {
  modal.style.display = "none";
});

again.addEventListener("click", () => {
  modal.style.display = "none";
  clear();
});

clearBtn.addEventListener("click", () => {
  clear();
});

boxes.forEach(function (box) {
  box.addEventListener("click", function () {
    if (box.innerHTML === "" && running) {
      if (turn % 2 === 0) {
        box.innerHTML = "X";
        checkWin(1);
        turn++;
        if (singlePlayer && running) {
          computerTurn();
          checkWin(2);
          turn++;
        }
      } else {
        box.innerHTML = "O";
        checkWin(2);
        turn++;
      }
    }
  });
});

function computerTurn() {
  // if there are 2 X in a row, place O in the third box, use a loop to check for all the possible win conditions
  for (var i = 0; i < 9; i++) {
    if (map[i] === 0) {
      map[i] = 2;
      if (winConditon(2)) {
        boxes[i].innerHTML = "O";
        map[i] = 2;
        return;
      } else {
        map[i] = 0;
      }
    }
  }

  // if there are 2 O in a row, place O in the third box, use a loop to check for all the possible win conditions
  for (var i = 0; i < 9; i++) {
    if (map[i] === 0) {
      map[i] = 1;
      if (winConditon(1)) {
        boxes[i].innerHTML = "O";
        map[i] = 2;
        return;
      } else {
        map[i] = 0;
      }
    }
  }

  // if there is no 2 X in a row, place O in the middle box
  if (map[4] === 0) {
    boxes[4].innerHTML = "O";
    map[4] = 2;
    return;
  }

  // if there are no 2 X in a row and the middle box is taken, place O in a random corner
  var corners = [0, 2, 6, 8];
  var randomCorner = corners[Math.floor(Math.random() * 4)];
  if (map[randomCorner] === 0) {
    boxes[randomCorner].innerHTML = "O";
    map[randomCorner] = 2;
    return;
  }

  // if there are no 2 X in a row and the middle box is taken and no corners are available, place O in a random side
  var sides = [1, 3, 5, 7];
  var randomSide = sides[Math.floor(Math.random() * 4)];
  if (map[randomSide] === 0) {
    boxes[randomSide].innerHTML = "O";
    map[randomSide] = 2;
    return;
  }

  // if there are no 2 X in a row and the middle box is taken and no corners are available and no sides are available, place O in a random box
  var randomBox = Math.floor(Math.random() * 9);
  if (map[randomBox] === 0) {
    boxes[randomBox].innerHTML = "O";
    map[randomBox] = 2;
    return;
  } else {
    while (map[randomBox] !== 0) {
      randomBox = Math.floor(Math.random() * 9);
    }
    boxes[randomBox].innerHTML = "O";
    map[randomBox] = 2;
    return;
  }
}

function clear() {
  boxes.forEach((box) => {
    box.innerHTML = "";
  });
  removeWinBox();
  turn = 0;
  map = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  running = true;
}

function removeWinBox() {
  map.forEach(function (box, index) {
    if (box === 1 || box === 2) {
      boxes[index].classList.remove("win");
    }
  });
}

function checkWin(player) {
  boxes.forEach(function (box, index) {
    if (box.innerHTML === "X") {
      map[index] = 1;
    } else if (box.innerHTML === "O") {
      map[index] = 2;
    }
  });

  if (winConditon(player)) {
    colorWinBox(player);
    displayModal(player);
  } else if (tieCondition()) {
    displayModal("Tie");
  }
}

function displayModal(player) {
  running = false;
  if (player === 1) {
    winner.innerHTML = "Player X wins!";
  } else if (player === 2) {
    winner.innerHTML = "Player O wins!";
  } else {
    winner.innerHTML = "It's a tie!";
  }
  // wait 3 seconds then create the modal
  setTimeout(function () {
    modal.style.display = "block";
    modal.classList.add("fade-in");
  }, 1000);

  setTimeout(function () {
    modal.classList.remove("fade-in");
    modal.style.display = "none";
  }, 10000);
}

function tieCondition() {
  if (turn === 8) {
    return true;
  }
  return false;
}

function winConditon(player) {
  if (
    (map[0] === player && map[1] === player && map[2] === player) ||
    (map[3] === player && map[4] === player && map[5] === player) ||
    (map[6] === player && map[7] === player && map[8] === player) ||
    (map[0] === player && map[3] === player && map[6] === player) ||
    (map[1] === player && map[4] === player && map[7] === player) ||
    (map[2] === player && map[5] === player && map[8] === player) ||
    (map[0] === player && map[4] === player && map[8] === player) ||
    (map[2] === player && map[4] === player && map[6] === player)
  ) {
    return true;
  }

  return false;
}

function colorWinBox(player) {
  if (map[0] === player && map[1] === player && map[2] === player) {
    boxes[0].classList.add("win");
    boxes[1].classList.add("win");
    boxes[2].classList.add("win");
  } else if (map[3] === player && map[4] === player && map[5] === player) {
    boxes[3].classList.add("win");
    boxes[4].classList.add("win");
    boxes[5].classList.add("win");
  } else if (map[6] === player && map[7] === player && map[8] === player) {
    boxes[6].classList.add("win");
    boxes[7].classList.add("win");
    boxes[8].classList.add("win");
  } else if (map[0] === player && map[3] === player && map[6] === player) {
    boxes[0].classList.add("win");
    boxes[3].classList.add("win");
    boxes[6].classList.add("win");
  } else if (map[1] === player && map[4] === player && map[7] === player) {
    boxes[1].classList.add("win");
    boxes[4].classList.add("win");
    boxes[7].classList.add("win");
  } else if (map[2] === player && map[5] === player && map[8] === player) {
    boxes[2].classList.add("win");
    boxes[5].classList.add("win");
    boxes[8].classList.add("win");
  } else if (map[0] === player && map[4] === player && map[8] === player) {
    boxes[0].classList.add("win");
    boxes[4].classList.add("win");
    boxes[8].classList.add("win");
  } else if (map[2] === player && map[4] === player && map[6] === player) {
    boxes[2].classList.add("win");
    boxes[4].classList.add("win");
    boxes[6].classList.add("win");
  }
}
