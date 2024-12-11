// Das Array, das den Zustand des Spielfelds speichert
let fields = [null, null, null, null, null, null, null, null, null];
let currentPlayer = "circle"; // Aktueller Spieler
let gameOver = false; // Initial: Spiel läuft

function init() {
  render();
}

function render() {
  const contentDiv = document.getElementById("content");
  let tableHTML = '<table class="tic-tac-toe">';

  for (let i = 0; i < 3; i++) {
    tableHTML += "<tr>";
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      const symbol =
        fields[index] === "circle"
          ? createAnimatedCircle()
          : fields[index] === "cross"
          ? createAnimatedCross()
          : "";

      // onclick-Attribut hinzufügen
      tableHTML += `<td onclick="handleClick(${index}, this)" id="cell-${index}">${symbol}</td>`;
    }
    tableHTML += "</tr>";
  }

  tableHTML += "</table>";
  contentDiv.innerHTML = tableHTML;
}

function handleClick(index, tdElement) {
  // Wenn das Spiel vorbei ist, keine weitere Aktion zulassen
  if (gameOver) return;

  // Überprüfen, ob das Feld bereits belegt ist
  if (!fields[index]) {
    // Das aktuelle Symbol setzen
    fields[index] = currentPlayer;

    // Den entsprechenden HTML-Code in das angeklickte <td> einfügen
    tdElement.innerHTML =
      currentPlayer === "circle"
        ? createAnimatedCircle()
        : createAnimatedCross();

    // Entfernen des onclick-Attributs
    tdElement.removeAttribute("onclick");

    // Überprüfen, ob das Spiel vorbei ist
    const winningCombination = checkWin();
    if (winningCombination) {
      gameOver = true; // Spiel beenden
      drawWinningLine();
      return;
    }

    // Wechseln zum nächsten Spieler
    currentPlayer = currentPlayer === "circle" ? "cross" : "circle";
  }
}

function checkWin() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
      return combination; // Gibt die siegreiche Kombination zurück
    }
  }
  return null; // Kein Sieg
}

function drawWinningLine() {
  const winningCombination = checkWin();
  if (!winningCombination) return;

  const [a, b, c] = winningCombination;
  const cellA = document.getElementById(`cell-${a}`);
  const cellC = document.getElementById(`cell-${c}`);

  const container = document.getElementById("content");
  const containerRect = container.getBoundingClientRect();
  const rectA = cellA.getBoundingClientRect();
  const rectC = cellC.getBoundingClientRect();

  const startX = rectA.left - containerRect.left + rectA.width / 2;
  const startY = rectA.top - containerRect.top + rectA.height / 2;
  const endX = rectC.left - containerRect.left + rectC.width / 2;
  const endY = rectC.top - containerRect.top + rectC.height / 2;

  const svgLine = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );
  svgLine.setAttribute("x1", startX);
  svgLine.setAttribute("y1", startY);
  svgLine.setAttribute("x2", endX);
  svgLine.setAttribute("y2", endY);
  svgLine.setAttribute("stroke", "white");
  svgLine.setAttribute("stroke-width", "4");
  svgLine.setAttribute("stroke-linecap", "round");

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", containerRect.width);
  svg.setAttribute("height", containerRect.height);
  svg.setAttribute(
    "style",
    "position: absolute; top: 0; left: 0; pointer-events: none;"
  );
  svg.appendChild(svgLine);

  container.style.position = "relative"; // Damit das SVG korrekt positioniert wird
  container.appendChild(svg);
}

function createAnimatedCircle() {
  return `<svg width="70" height="70" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
              <circle cx="25" cy="25" r="20" stroke="#00B0EF" stroke-width="4" fill="none" stroke-dasharray="126" stroke-dashoffset="126">
                <animate attributeName="stroke-dashoffset" from="126" to="0" dur="0.2s" fill="freeze" />
              </circle>
            </svg>`;
}

function createAnimatedCross() {
  return `<svg width="70" height="70" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
              <line x1="10" y1="10" x2="40" y2="40" stroke="#FFC000" stroke-width="4" stroke-dasharray="42" stroke-dashoffset="42">
                <animate attributeName="stroke-dashoffset" from="42" to="0" dur="0.2s" fill="freeze" />
              </line>
              <line x1="40" y1="10" x2="10" y2="40" stroke="#FFC000" stroke-width="4" stroke-dasharray="42" stroke-dashoffset="42">
                <animate attributeName="stroke-dashoffset" from="42" to="0" dur="0.2s" fill="freeze" />
              </line>
            </svg>`;
}

function restartGame() {
  fields = [null, null, null, null, null, null, null, null, null];
  render();
}
