const express = require("express");
const connect = require("./config/db");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT;
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const authRouter = require('../src/routes/auth.routes');
const serviceRouter = require('../src/routes/service.routes');
const getOtherDataRoutes = require('./routes/getOtherData.routes');
const walletRouter = require('../src/routes/wallet.routes');
const socketController = require('./controllers/socketController');
const getMessages = require("./routes/getMessages.routes");

app.get("/", (req, res) => {
  res.send("Namaste");
});

app.use('/getOtherData', getOtherDataRoutes);
app.use('/auth', authRouter);
app.use('/service', serviceRouter);
app.use('/wallet', walletRouter);
app.use("/getMessages", getMessages);

io.on("connection", (socket) => {
  console.log("user connected with socket id:- " + socket.id);
  socketController(socket);
});

server.listen(port, () => {
  connect();
  console.log(`Listening on ${port}`);
});
