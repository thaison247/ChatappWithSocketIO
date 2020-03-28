var socket = io("http://localhost:3000");

socket.on("Server-warning-duplicatedUsername", function() {
  alert("Duplicated Username!!! Please try another name!");
});

socket.on("Server-send-joinSuccess", function(returnData) {
  $("#login").hide(1000);
  $("#chat-form").show(1000);

  let user = returnData.joinInfo.name;
  let room = returnData.joinInfo.room;
  let time = returnData.time;

  let msg = `<div id="chat-friend" class="d-flex justify-content-start mb-4">
    				<div class="img_cont_msg">
  					<img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg">
  				</div>
  				<div class="msg_cotainer">Hi ${user}. Welcome to #${room}!
  	  				<span class="msg_time">${time}</span>
    				</div>
			  </div>`;

  $("#chatlogs").append(msg);
  $(".user_info > span").html("#" + room);

  $(".contacts").html("");

  let listUsers = returnData.listUsers;
  listUsers.forEach(user => {
    let oneUser = `<li class="active">
	  <div class="d-flex bd-highlight">
		  <div class="user_info">
			  <span>${user}</span>
			  <p>${user} is online</p>
		  </div>
	  </div>
  </li>`;
    $(".contacts").append(oneUser);
  });
});

socket.on("Server-send-newMember", function(returnData) {
  let newMember = returnData.joinInfo.name;

  let msg = `<div id="chat-friend" class="d-flex justify-content-start mb-4">
    				<div class="img_cont_msg">
  					<img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg">
  				</div>
  				<div class="msg_cotainer">User <span style="color: red">#${newMember}</span> has joined this room!
  	  				<span class="msg_time">${returnData.time}</span>
    				</div>
			  </div>`;

  $("#chatlogs").append(msg);

  $(".contacts").html("");
  let listUsers = returnData.listUsers;
  listUsers.forEach(user => {
    let oneUser = `<li class="active">
	  <div class="d-flex bd-highlight">
		  <div class="user_info">
			  <span>${user}</span>
			  <p>${user} is online</p>
		  </div>
	  </div>
  </li>`;
    $(".contacts").append(oneUser);
  });
});

socket.on("Server-send-selfMessage", function(data) {
  let msg = `<div id="chat-self" class="d-flex justify-content-end mb-4">
	<div class="msg_cotainer_send">
		${data.message}
		<span class="msg_time_send">${data.time}</span>
	</div>

</div>`;
  $("#chatlogs").append(msg);
  $("#chatlogs").animate(
    {
      scrollTop: $("#chatlogs").get(0).scrollHeight
    },
    1000
  );
});

socket.on("Server-send-message", function(data) {
  let msg = `<div id="chat-friend" class="d-flex justify-content-start mb-4">
	<div class="msg_cotainer">
		${data.message}
		<span class="msg_time"><span style="color: #e9ff00">${data.userName}</span> --- ${data.time}</span>
	</div>
</div>`;
  $("#chatlogs").append(msg);
  $("#chatlogs").animate(
    {
      scrollTop: $("#chatlogs").get(0).scrollHeight
    },
    1000
  );
});

socket.on("Server-send-logoutUser", function(data) {
  let msg = `<div id="chat-friend" class="d-flex justify-content-start mb-4">
    				<div class="img_cont_msg">
  					<img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg">
  				</div>
  				<div class="msg_cotainer"><span style="color: red">#${data.userName}</span> has left this room!
  	  				<span class="msg_time">${data.time}</span>
    				</div>
			  </div>`;

  $("#chatlogs").append(msg);
  $("#chatlogs").animate(
    {
      scrollTop: $("#chatlogs").get(0).scrollHeight
    },
    1000
  );
});

socket.on("Server-send-listUsers", function(listUsers) {
  $(".contacts").html("");
  listUsers.forEach(user => {
    let oneUser = `<li class="active">
	  <div class="d-flex bd-highlight">
		  <div class="user_info">
			  <span>${user}</span>
			  <p>${user} is online</p>
		  </div>
	  </div>
  </li>`;
    $(".contacts").append(oneUser);
    $("#chatlogs").animate(
      {
        scrollTop: $("#chatlogs").get(0).scrollHeight
      },
      1000
    );
  });
});

$(document).ready(function() {
  $("#action_menu_btn").click(function() {
    $(".action_menu").toggle();
  });

  $("#login").show();
  $("#chat-form").hide();

  $("#btnJoinRoom").click(function() {
    socket.emit("Client-join-room", {
      name: $("#txtUsername").val(),
      room: $("#txtRoomId").val()
    });
  });

  $(".send_btn").click(function() {
    let message = $(".type_msg").val();
    $(".type_msg").val("");
    socket.emit("Client-send-message", message);
  });

  $(".type_msg").keypress(function(event) {
    var keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode == "13") {
      let message = $(".type_msg").val();
      $(".type_msg").val("");
      socket.emit("Client-send-message", message);
    }
  });

  $("#exit_btn").click(function() {
    location.reload();
  });
});
