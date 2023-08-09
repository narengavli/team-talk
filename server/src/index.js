const express = require("express");
const cors = require("cors");
const socket = require("socket.io")
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;
const DB = process.env.MONGODB_LINK;

// import routes
const messageRoutes = require("./routes/messages")
const authRoutes = require("./routes/auth")

app.use(cors());
app.use(express.json());

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DB Connection Successful");
    })
    .catch((err) => {
        console.log(err.message);
    });

// set Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// API Home page
app.get('/', (req, res) => {
    res.send("<div><h3>API is working perfectly.</h3>More about author: <a href='https://narengavli.github.io'>narengavli</a></div>")
});

const server = app.listen(port, () =>
    console.log(`Server started on ${port}.`)
);

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.msg);
        }
    });
});