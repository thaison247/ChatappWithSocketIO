var express = require("express");
var app = express();
app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

var listUsers = [];

io.on("connection", function(socket) {
  console.log("Co nguoi ket noi");
  socket.on("Client-send-Username", function(data) {
    if (listUsers.indexOf(data) >= 0) {
      socket.emit("Server-send-RegisterFail");
    } else {
      listUsers.push(data);
      socket.userName = data;
      socket.emit("Server-send-RegisterSuccess", data);
      io.sockets.emit("Server-send-ListUsers", listUsers);
    }
  });

  socket.on("Client-send-Logout", function() {
    // remove username out of listUsers
    listUsers.splice(listUsers.indexOf(socket.userName), 1);

    // notify other clients
    socket.broadcast.emit("Server-send-ListUsers", listUsers);
  });

  socket.on("Client-send-Message", function(data) {
    io.sockets.emit("Server-send-Message", {
      username: socket.userName,
      content: data
    });
  });

  // socket.on("Client-send-Typing", function() {
  //   socket.broadcast.emit("Server-send-TypingUser", socket.userName);
  // });

  // socket.on("Client-send-StopTyping", function() {
  //   socket.broadcast.emit("Server-send-StopTypingNoti");
  // });
});

app.get("/", (req, res) => {
  res.render("home.ejs");
});
