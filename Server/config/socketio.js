module.exports = function (server) {

	var io = require('socket.io')(server);

	// Socket IO events
	io.on('connection', function (socket) {
	  console.log('new connection');

	  // Add users to discussion rooms
	  socket.on('enter discussion', function (data) {

	    // Check if user already joined
	    if (socket.rooms.indexOf(data.question_id) === -1) {
	      socket.join(data.question_id);
	      // console.log(socket.rooms);
	    }
	  });

	  // Wait for new messages then boadcast to room
	  socket.on('message sent', function (data) {

	    // Broadcast to everyone in the room/everyone viewing the question
	    socket.broadcast.to(data.question_id).emit('new message', data);
	  });


	  // Remove users from discussion rooms
	  socket.on('leave discussion', function (data) {
	    socket.leave(data.question_id);
	    console.log(data.username + ' left question: ' + data.question_id)
	  });

	});

}
