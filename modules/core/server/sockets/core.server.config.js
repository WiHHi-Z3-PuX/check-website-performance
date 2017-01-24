'use strict';

// Create the chat configuration
module.exports = function (io, socket) {
  // Send a chat messages to all connected sockets when a message is received
  socket.on('chatMessage', function (message) {
    // Emit the 'chatMessage' event
    io.emit('chatMessage', message);
  });

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function () {
    io.emit('chatMessage', {
      type: 'status',
      text: 'disconnected',
      created: Date.now()
    });
  });
};
