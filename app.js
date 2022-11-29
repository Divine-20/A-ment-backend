const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const fileupload = require("express-fileupload");
const Parse = require("parse/node");
Parse.initialize(process.env.APP_ID, process.env.JS_KEY);
Parse.serverURL = "https://parseapi.back4app.com/";
const express = require("express");

const app = express();

const mongoose = require("mongoose");
const router = require("./routes/routes.js");

const socket = require("socket.io");

const { Swaggiffy } = require("swaggiffy");
new Swaggiffy().setupExpress(app).swaggiffy();

mongoose.connect(process.env.URL).then(() => {
  console.log("Database successfully connected");
});
const PORT = process.env.PORT;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
app.use(fileupload({ useTempFiles: true }));
app.use(express.json());
const stripe = require("stripe")(stripeSecretKey);
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.get("/payment", function (req, res) {
  res.render("home", {
    key: stripePublicKey,
  });
});
const io = socket(8080, {
  cors: {
    origin: process.env.ORIGIN,
    credentials: true,
  },
});
//store all online users inside this map
global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieved", data.message);
    }
  });
});
app.get("/", function (req, res) {
  res.send("Welcome to A_ment Backend");
});
app.use("/", router);
app.listen(PORT, () => {
  console.log(`The server is learning on port ${PORT}`);
});
