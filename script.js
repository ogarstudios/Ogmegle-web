const socket = io();
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let food = { x: 100, y: 100 };
let players = {};
let myId = null;

socket.on("init", (data) => {
    food = data.food;
    players = data.players;
    myId = socket.id;
});

socket.on("updateGame", (data) => {
    food = data.food;
    players = data.players;
    draw();
});

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, 20, 20);

    for (let id in players) {
        let player = players[id];
        ctx.fillStyle = id === myId ? "lime" : "blue";
        player.snake.forEach(segment => ctx.fillRect(segment.x, segment.y, 20, 20));
    }

    document.getElementById("score").innerText = players[myId] ? players[myId].score : 0;
}

function changeDirection(dir) {
    let direction = { x: 0, y: 0 };
    if (dir === "up") direction = { x: 0, y: -20 };
    if (dir === "down") direction = { x: 0, y: 20 };
    if (dir === "left") direction = { x: -20, y: 0 };
    if (dir === "right") direction = { x: 20, y: 0 };
    
    socket.emit("move", direction);
}

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") changeDirection("up");
    if (e.key === "ArrowDown") changeDirection("down");
    if (e.key === "ArrowLeft") changeDirection("left");
    if (e.key === "ArrowRight") changeDirection("right");
});
