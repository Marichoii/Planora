const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

let cellsize = 9;
let scale = 2;
let offsetx = 0;
let offsety = 0;
let leftMouseDown = false;
let rightMouseDown = false;
let walls = [];
let isDrawing = false;
let startPoint = null;
let currentPoint = null;
let history = [];
let currentHistoryIndex = -1;
let selectedElementType = 'wall'; // Tipo padrão

// Configuração de cores para cada tipo de elemento
const elementColors = {
  wall: '#000000',
  desk: '#4CAF50',    // Verde
  shelf: '#2196F3',   // Azul
  window: '#FFC107',  // Amarelo
  door: '#F44336',    // Vermelho
  varied: '#9C27B0'   // Roxo
};

// Configuração de estilos para cada tipo de elemento
const elementStyles = {
  wall: { width: 8, opacity: 'FF' },
  desk: { width: 6, opacity: 'FF' },
  shelf: { width: 6, opacity: 'FF' },
  window: { width: 4, opacity: 'FF' },
  door: { width: 4, opacity: 'FF' },
  varied: { width: 6, opacity: 'FF' }
};

// Adiciona event listeners para os botões de seleção de elemento
document.querySelectorAll('.element-select').forEach(button => {
  button.addEventListener('click', function() {
    selectedElementType = this.dataset.type;
    // Remove a classe ativa de todos os botões
    document.querySelectorAll('.element-select').forEach(btn => {
      btn.parentElement.parentElement.style.backgroundColor = '';
    });
    // Adiciona a classe ativa ao botão selecionado
    this.parentElement.parentElement.style.backgroundColor = '#e0e0e0';
  });
});

function toScreenX(xTrue) {
  return (xTrue + offsetx) * scale;
}

function toScreenY(yTrue) {
  return (yTrue + offsety) * scale;
}

function toTrueX(xScreen) {
  return (xScreen / scale) - offsetx;
}

function toTrueY(yScreen) {
  return (yScreen / scale) - offsety;
}

function trueHeight() {
  return canvas.clientHeight / scale;
}

function trueWidth() {
  return canvas.clientWidth / scale;
}

function draw() {
  if (canvas && ctx) {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
  }
}

function addToHistory() {
  history = history.slice(0, currentHistoryIndex + 1);
  history.push(JSON.stringify(walls));
  currentHistoryIndex++;
}

function undo() {
  if (currentHistoryIndex > 0) {
    currentHistoryIndex--;
    walls = JSON.parse(history[currentHistoryIndex]);
    draw();
  }
}

function redo() {
  if (currentHistoryIndex < history.length - 1) {
    currentHistoryIndex++;
    walls = JSON.parse(history[currentHistoryIndex]);
    draw();
  }
}

function snapToGrid(x, y) {
  const gridX = Math.round(x / cellsize) * cellsize;
  const gridY = Math.round(y / cellsize) * cellsize;
  return { x: gridX, y: gridY };
}

// Função de snap com magnetismo nos vértices
function snapToGridWithMagnet(x, y) {
  // Snap normal ao grid
  const gridX = Math.round(x / cellsize) * cellsize;
  const gridY = Math.round(y / cellsize) * cellsize;
  let snapped = { x: gridX, y: gridY };

  // Distância de tolerância para o magnetismo (em unidades reais)
  const tolerance = 10;

  // Procura por pontos próximos nos endpoints das linhas existentes
  for (const wall of walls) {
    const points = [wall.from, wall.to];
    for (const pt of points) {
      const dist = Math.hypot(pt.x - snapped.x, pt.y - snapped.y);
      if (dist <= tolerance) {
        // Se estiver perto o suficiente, "gruda" no ponto existente
        return { x: pt.x, y: pt.y };
      }
    }
  }
  // Se não achou nenhum ponto próximo, retorna o snap normal
  return snapped;
}

function onMouseDown(event) {
  if (event.button === 0) {
    leftMouseDown = true;
    rightMouseDown = false;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const scaledX = toTrueX(x);
    const scaledY = toTrueY(y);
    const snappedPoint = snapToGridWithMagnet(scaledX, scaledY);

    if (!isDrawing) {
      isDrawing = true;
      startPoint = snappedPoint;
      currentPoint = snappedPoint;
    } else {
      walls.push({
        from: startPoint,
        to: snappedPoint,
        type: selectedElementType
      });
      addToHistory();
      isDrawing = false;
      startPoint = null;
      currentPoint = null;
      draw();
    }
  }
  if (event.button === 2) {
    rightMouseDown = true;
    leftMouseDown = false;
  }

  cursorX = event.clientX;
  cursorY = event.clientY;
  prevCursorX = event.clientX;
  prevCursorY = event.clientY;
}

function onMouseMove(event) {
  const rect = canvas.getBoundingClientRect();
  const cursorX = event.clientX - rect.left;
  const cursorY = event.clientY - rect.top;
  const scaledX = toTrueX(cursorX);
  const scaledY = toTrueY(cursorY);
  const prevScaledX = toTrueX(prevCursorX);
  const prevScaledY = toTrueY(prevCursorY);
  if (isDrawing) {
    currentPoint = snapToGridWithMagnet(scaledX, scaledY);
    draw();
  }
  if (rightMouseDown) {
    offsetx += (cursorX - prevCursorX) / scale;
    offsety += (cursorY - prevCursorY) / scale;
    draw();
  }
  prevCursorX = cursorX;
  prevCursorY = cursorY;
}

function onMouseUp() {
  leftMouseDown = false;
  rightMouseDown = false;
}

function onMouseWheel(event) {
  const deltaY = event.deltaY;
  const scaleAmount = -deltaY / 500;
  scale = scale * (1 + scaleAmount);

  const distX = event.pageX / canvas.clientWidth;
  const distY = event.pageY / canvas.clientHeight;

  const unitsZoomedX = trueWidth() * scaleAmount;
  const unitsZoomedY = trueHeight() * scaleAmount;

  const unitsAddLeft = unitsZoomedX * distX;
  const unitsAddTop = unitsZoomedY * distY;

  offsetx -= unitsAddLeft;
  offsety -= unitsAddTop;

  draw();
}

function drawGrid() {
  if (canvas && ctx) {
    ctx.strokeStyle = '#00000049';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    // Desenha a grade
    for (
      let x = (offsetx % cellsize) * scale;
      x <= width;
      x += cellsize * scale
    ) {
      const source = x;
      ctx.moveTo(source, 0);
      ctx.lineTo(source, height);
    }

    for (
      let y = (offsety % cellsize) * scale;
      y <= height;
      y += cellsize * scale
    ) {
      const destination = y;
      ctx.moveTo(0, destination);
      ctx.lineTo(width, destination);
    }
    ctx.stroke();

    // Desenha as paredes e elementos
    walls.forEach(wall => {
      const style = elementStyles[wall.type] || elementStyles.wall;
      const color = elementColors[wall.type] || elementColors.wall;
      
      ctx.strokeStyle = color + style.opacity;
      ctx.lineWidth = style.width;
      ctx.beginPath();
      ctx.moveTo(toScreenX(wall.from.x), toScreenY(wall.from.y));
      ctx.lineTo(toScreenX(wall.to.x), toScreenY(wall.to.y));
      ctx.stroke();

      // Desenha círculo no início
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(toScreenX(wall.from.x), toScreenY(wall.from.y), style.width / 1.5, 0, 2 * Math.PI);
      ctx.fill();

      // Desenha círculo no fim
      ctx.beginPath();
      ctx.arc(toScreenX(wall.to.x), toScreenY(wall.to.y), style.width / 1.5, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Desenha a linha temporária durante o desenho
    if (isDrawing && startPoint && currentPoint) {
      const style = elementStyles[selectedElementType] || elementStyles.wall;
      const color = elementColors[selectedElementType] || elementColors.wall;
      
      ctx.strokeStyle = color + '7B'; // Adiciona transparência
      ctx.lineWidth = style.width;
      ctx.beginPath();
      ctx.moveTo(toScreenX(startPoint.x), toScreenY(startPoint.y));
      ctx.lineTo(toScreenX(currentPoint.x), toScreenY(currentPoint.y));
      ctx.stroke();
    }
  }
}

function saveWalls() {
  const jsonString = JSON.stringify(walls, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  a.download = `Mapas/mapa_${timestamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Event Listeners
document.oncontextmenu = function () {
  return false;
}

canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp, false);
canvas.addEventListener('mouseout', onMouseUp, false);
canvas.addEventListener('mousemove', onMouseMove, false);
canvas.addEventListener('wheel', onMouseWheel, false);

document.addEventListener('keydown', function(event) {
  if (event.ctrlKey) {
    if (event.key === 'z') {
      event.preventDefault();
      undo();
    } else if (event.key === 'y') {
      event.preventDefault();
      redo();
    }
  }
});

window.addEventListener("resize", (event) => {
  draw();
});

// Auto-save a cada 5 minutos
setInterval(() => {
  if (walls.length > 0) {
    saveWalls();
  }
}, 5 * 60 * 1000);

// Inicialização
draw(); 