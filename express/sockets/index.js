
const socketHandler = (socket, io) => {
  console.log('A user connected:', socket.id);

  socket.on('sendMessage', (message) => {
    socket.broadcast.emit('sendMessage', message)
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
};

export default socketHandler;
