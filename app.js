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
const port = process.env.PORT || 3000

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

let users = [];

io.on("connection", (socket) => {
  // console.log("New user connected", socket.id);
  socket.emit("message", "Welcome to the socket server" + socket.id);
  // ...

  socket.on("count:update", (newCount) => {
    console.log({ newCount });
    // socket.broadcast.emit("count:info", newCount);
    io.emit("count:info", newCount);
  });

  // console.log("username: ", socket.handshake.auth.username);
  if (socket.handshake.auth.username) {
    users.push({
      id: socket.id,
      username: socket.handshake.auth.username,
    });
  }

  io.emit("users:online", users);

  socket.on("pilihan:jawaban", (jawaban, jawabanP1, jawabanP2) => {
    console.log('=======');
    console.log(jawaban, "ini di server");
    console.log(jawabanP1, "ini jawabanP1");
    console.log(jawabanP2, "ini jawabanP2");
    socket.broadcast.emit("terima:jawaban", jawaban, jawabanP1, jawabanP2)
  })

  socket.on("kirim:clue", (clue) => {
    // console.log(clue, "<< ini di server");
    socket.broadcast.emit("terima:clue", clue)
  })
  socket.on("change:player", (username) => {
    socket.broadcast.emit("terima:username", username)
  })

  socket.on("current:score", (score) => {
    // console.log(score, "ini score");
    socket.broadcast.emit("terima:score", score)
  })

  socket.on("disconnect", () => {
    users = users.filter((el) => el.id !== socket.id);
    io.emit("terima:jawaban", "")

    io.emit("users:online", users);
  });
  // console.log("online users: ", users);
});

app.get("/", (req, res, next) => {
  res.send("Hello World");
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
