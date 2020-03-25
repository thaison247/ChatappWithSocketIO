var socket = io("http://localhost:3000");

socket.on("Server-send-RegisterFail", function() {
  alert("Da co nguoi dang ki username nay");
});

socket.on("Server-send-RegisterSuccess", function(data) {
  $("#currentUser").html(data);
  $("#loginForm").hide(2000);
  $("#chatForm").show(1000);
});

socket.on("Server-send-ListUsers", function(data) {
  $("#boxContent").html("");
  data.forEach(function(i) {
    $("#boxContent").append("<div class = 'user'>" + i + "</div>");
  });
});

socket.on("Server-send-Message", function(data) {
  $("#listMessages").append(
    "<div id='message'>" + data.username + ": " + data.content + "</div>"
  );
});

// socket.on("Server-send-TypingUser", function(data) {
//   $("#typingNoti")
//     .html("")
//     .html(data + " is typing");
// });

// socket.on("Server-send-StopTypingNoti", function() {
//   $("#typingNoti").html("");
// });

$(document).ready(function() {
  $("#loginForm").show();
  $("#chatForm").hide();

  $("#btnRegister").click(function() {
    socket.emit("Client-send-Username", $("#txtUsername").val());
  });

  $("#btnLogout").click(function() {
    socket.emit("Client-send-Logout");
    $("#loginForm").show(1000);
    $("#chatForm").hide(500);
  });

  $("#btnSendMessage").click(function() {
    socket.emit("Client-send-Message", $("#txtMessage").val());
  });

  //   $("#txtMessage").focusin(function() {
  //     socket.emit("Client-send-Typing");
  //   });

  //   $("#txtMessage").focusout(function() {
  //     socket.emit("Client-send-StopTying");
  //   });
});
