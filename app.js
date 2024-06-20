const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const router = require("./routes");
const cors = require("cors");
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

let users = [];

io.on("connection", (socket) => {
  console.log("New user connected", socket.id);
  socket.emit("message", "Welcome to the socket server" + socket.id);
  // ...

  socket.on("count:update", (newCount) => {
    console.log({ newCount });
    // socket.broadcast.emit("count:info", newCount);
    io.emit("count:info", newCount);
  });

  console.log("username: ", socket.handshake.auth.username);
  if (socket.handshake.auth.username) {
    users.push({
      id: socket.id,
      username: socket.handshake.auth.username,
    });
  }

  io.emit("users:online", users);

  socket.on("disconnect", () => {
    users = users.filter((el) => el.id !== socket.id);
    io.emit("users:online", users);
  });
  console.log("online users: ", users);
});

app.get("/", (req, res, next) => {
  res.send("Hello World");
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
