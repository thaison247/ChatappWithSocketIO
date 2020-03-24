var express = require("express");
var app = express();
app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

io.on("connection", function(socket) {
  console.log("Co nguoi ket noi");
  socket.on("disconnect", function() {
    console.log(socket.id + " vua ngat ket noi");
  });
});

app.get("/", (req, res) => {
  res.render("home.ejs");
});
