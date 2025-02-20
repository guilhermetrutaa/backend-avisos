const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

let avisos = []; // Lista de avisos armazenados
let eventos = []; // Lista de eventos armazenados

// Rota para buscar os avisos via HTTP
app.get("/avisos", (req, res) => {
  res.json(avisos);
});

// Rota para buscar os eventos via HTTP
app.get("/eventos", (req, res) => {
  res.json(eventos);
});

// Conectar ao WebSocket
io.on("connection", (socket) => {
  console.log("Novo usuário conectado:", socket.id);

  // Enviar avisos e eventos ao usuário que acabou de entrar
  socket.emit("avisos", avisos);
  socket.emit("eventos", eventos);

  // Receber um novo aviso
  socket.on("novo_aviso", (aviso) => {
    avisos.push(aviso);
    io.emit("avisos", avisos); // Enviar para todos os clientes conectados
  });

  // Receber um novo evento
  socket.on("novo_evento", (evento) => {
    eventos.push(evento);
    io.emit("eventos", eventos); // Enviar para todos os clientes conectados
  });

  // Desconectar
  socket.on("disconnect", () => {
    console.log("Usuário desconectado:", socket.id);
  });
});

// Rodar servidor
server.listen(4000, () => console.log("Servidor WebSocket rodando na porta 4000"));
