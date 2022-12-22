function socketController(socket) {
  socket.on("join-room", (roomID, senderID) => {
    console.log("joined room with roomID :- " + roomID);
    socket.join(senderID);
    socket.join(roomID);
    console.log(socket.rooms);
  });
  socket.on("send-msg", (msgToSend, email, roomID, senderID) => {
    socket.to(roomID).to(senderID).emit("receive-msg", msgToSend, email);
  });
}

module.exports = socketController;
