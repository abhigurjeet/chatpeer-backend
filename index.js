require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const userRouter = require("./Routes/userRoute");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;
const { Server } = require("socket.io");
const socketio = require("socket.io");
const server = require("http").Server(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Authorization"],
  },
});
// Connect to database
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.DB_URL);
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Expose-Headers", "Authorization");
  next();
});
app.use("/", userRouter);

io.on("connection", (socket) => {
  socket.on("sendMessage", (message) => {
    io.emit("message", message);
  });

  socket.on("disconnect", () => {});
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
