const messageModel = require("../models/message.model");

function socketController(socket) {
  socket.on("join-room", (roomID, senderID) => {
    console.log("joined room with roomID :- " + roomID);
    socket.join(senderID);
    socket.join(roomID);
    console.log(socket.rooms);
  });
  socket.on("send-msg", (msgToSend, senderEmail, receiverEmail, roomID, senderID) => {
    socket.to(roomID).to(senderID).emit("receive-msg", msgToSend, senderEmail, receiverEmail);
    messageModel.findOne({ roomID: roomID }).then((res) => {
      if (res) {
        messageModel.updateOne(
          { roomID: roomID },
          { $push: { messages: { from: senderEmail, to: receiverEmail, message: msgToSend } } },
          { upsert: true },
          (err, msg) => {
            console.log(err, msg);
          }
        );
      } else {
        messageModel.insertMany([{ roomID: roomID, messages: new Array(1).fill({ from: senderEmail, to: receiverEmail, message: msgToSend }) }]);
      }
    });
  });
}

module.exports = socketController;
