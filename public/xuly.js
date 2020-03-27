var socket = io("http://localhost:3000");

socket.on("Server-send-joinSuccess", function(joinInfo) {
  $("#login").hide(1000);
  $("#chatlogs").show(1000);
  $(".chat-form").show(1000);

  $("#chatlogs").append(
    "<div class='chat friend'><div class='user-photo'><img src='#' alt='user image'></div><p class='chat-message'>" +
      joinInfo.name +
      ", Welcome to " +
      joinInfo.room +
      "</p></div>"
  );
});

socket.on("Server-send-selfMessage", function(data) {
  let msg =
    "<div class='chat self'><div class='user-photo'>" +
    data.sender +
    "</div><p class='chat-message'>" +
    data.message +
    "</p></div>";
  $("#chatlogs").append(msg);
});

socket.on("Server-send-message", function(data) {
  let msg =
    "<div class='chat friend'><div class='user-photo'>" +
    data.sender +
    "</div><p class='chat-message'>" +
    data.message +
    "</p></div>";
  $("#chatlogs").append(msg);
});

socket.on("Server-send-message", function(data) {});

$(document).ready(function() {
  $("#login").show();
  $("#chatlogs").hide();
  $(".chat-form").hide();

  $("#btnJoinRoom").click(function() {
    socket.emit("Client-join-room", {
      name: $("#txtUsername").val(),
      room: $("#txtRoomId").val()
    });
  });

  $("#btnSend").click(function() {
    let message = $("#txtMessage").val();
    socket.emit("Client-send-message", message);
  });
});
