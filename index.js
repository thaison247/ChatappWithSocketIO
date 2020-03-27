var express = require("express");
var app = express();
app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

var usersFunc = require("./users.js");

var listUsers = []; // {name, room}
var globalData = new Object();

io.on("connection", function(socket) {
  console.log("Co nguoi ket noi");
  // listen to a join request from client
  socket.on("Client-join-room", function(joinInfo) {
    console.log(joinInfo);
    console.log(listUsers);
    // check duplicated username in one room
    if (
      listUsers.findIndex(
        user => joinInfo.name === user.name && joinInfo.room === user.room
      ) >= 0
    ) {
      socket.emit("Server-warning-duplicatedUsername");
    } else {
      listUsers.push(joinInfo);
      console.log(listUsers);
      socket.join(joinInfo.room);
      socket.userName = joinInfo.name;
      socket.roomId = joinInfo.room;

      let returnData = new Object();
      returnData.listUsers = usersFunc.findUsersByRoom(
        listUsers,
        joinInfo.room
      );
      returnData.joinInfo = joinInfo;

      // send a join succeeded respone to client
      socket.emit("Server-send-joinSuccess", returnData);

      //send 'new member has joined' notification
      socket.broadcast
        .to(socket.roomId)
        .emit("Server-send-newMember", returnData);

      // listen to a text message
      socket.on("Client-send-message", function(message) {
        //data: {message, userName}
        let data = new Object();
        data.message = message;
        data.userName = socket.userName;
        socket.emit("Server-send-selfMessage", data);
        socket.broadcast.to(socket.roomId).emit("Server-send-message", data);
      });

      // One User log out
      socket.on("disconnect", function() {
        // remove username out of listUsers
        listUsers.splice(listUsers.indexOf(socket.userName), 1);

        // notify other clients
        socket.broadcast
          .to(socket.roomId)
          .emit("Server-send-logoutUser", socket.userName);

        // send list users to others in the room
        let listUsersNow = usersFunc.findUsersByRoom(listUsers, joinInfo.room);
        socket.broadcast
          .to(socket.roomId)
          .emit("Server-send-listUsers", listUsersNow);
      });
    }
  });

  // socket.on("Client-send-Message", function(data) {
  //   io.sockets.emit("Server-send-Message", {
  //     username: socket.userName,
  //     content: data
  //   });
  // });

  // socket.on("Client-send-Typing", function() {
  //   socket.broadcast.emit("Server-send-TypingUser", socket.userName);
  // });

  // socket.on("Client-send-StopTyping", function() {
  //   socket.broadcast.emit("Server-send-StopTypingNoti");
  // });
});

app.get("/", (req, res) => {
  // res.render("home.ejs");
  res.render("chatbox.ejs");
});

// io.on("connection", function(socket) {
//   console.log("Co nguoi ket noi");
//   socket.on("Client-send-Username", function(data) {
//     if (listUsers.indexOf(data) >= 0) {
//       socket.emit("Server-send-RegisterFail");
//     } else {
//       listUsers.push(data);
//       socket.userName = data;
//       socket.emit("Server-send-RegisterSuccess", data);
//       io.sockets.emit("Server-send-ListUsers", listUsers);
//     }
//   });

//   socket.on("Client-send-Logout", function() {
//     // remove username out of listUsers
//     listUsers.splice(listUsers.indexOf(socket.userName), 1);

//     // notify other clients
//     socket.broadcast.emit("Server-send-ListUsers", listUsers);
//   });

//   socket.on("Client-send-Message", function(data) {
//     io.sockets.emit("Server-send-Message", {
//       username: socket.userName,
//       content: data
//     });
//   });

//   // socket.on("Client-send-Typing", function() {
//   //   socket.broadcast.emit("Server-send-TypingUser", socket.userName);
//   // });

//   // socket.on("Client-send-StopTyping", function() {
//   //   socket.broadcast.emit("Server-send-StopTypingNoti");
//   // });
// });
