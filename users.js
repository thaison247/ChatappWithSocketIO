module.exports = {
  findUsersByRoom: function(listUsers, room) {
    return listUsers.filter(user => user.room === room).map(user => user.name);
  }
};
