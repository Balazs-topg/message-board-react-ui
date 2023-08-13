const express = require("express");
const http = require("http");
const WebSocket = require("ws"); // Import the WebSocket library
const mongoose = require("mongoose");
const messageModel = require("./models/messageModel");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI).then(() => {});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server }); // Create a WebSocket server instance

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Send a welcome message to the connected client
  ws.send("Welcome to the WebSocket server!");

  // Handle incoming messages from the client if needed
  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
  });
});

app.get("/server-check", (req, res) => {
  console.log("server-check CALLED");
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  console.log("GET CALLED");
  messageModel
    .find({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

app.post("/create", async (req, res) => {
  const message = req.body;
  const newMessage = new messageModel(message);
  await newMessage.save();

  // Broadcast the new message to all connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });

  res.json(message);
});

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`SERVER IS RUNNING ON http://localhost:${port}/`);
});
