const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public")); // Serve frontend files

let food = { x: 100, y: 100 };
let players = {};

function generateFood() {
    food = {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20
    };
}

io.on("connection", (socket) => {
    players[socket.id] = {
        x: 200,
        y: 200,
        direction: { x: 20, y: 0 },
        snake: [{ x: 200, y: 200 }],
        score: 0
    };

    socket.emit("init", { food, players });

    socket.on("move", (direction) => {
        if (players[socket.id]) {
            players[socket.id].direction = direction;
        }
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
        io.emit("updatePlayers", players);
    });
});

setInterval(() => {
    for (let id in players) {
        let player = players[id];
        let newHead = {
            x: player.snake[0].x + player.direction.x,
            y: player.snake[0].y + player.direction.y
        };

        if (newHead.x === food.x && newHead.y === food.y) {
            player.score += 10;
            generateFood();
        } else {
            player.snake.pop();
        }

        player.snake.unshift(newHead);

        if (
            newHead.x < 0 || newHead.y < 0 ||
            newHead.x >= 400 || newHead.y >= 400 ||
            player.snake.slice(1).some(s => s.x === newHead.x && s.y === newHead.y)
        ) {
            players[id] = {
                x: 200, y: 200, direction: { x: 20, y: 0 },
                snake: [{ x: 200, y: 200 }], score: 0
            };
        }
    }

    io.emit("updateGame", { food, players });
}, 100);

server.listen(3000, () => console.log("Server running on port 3000"));
