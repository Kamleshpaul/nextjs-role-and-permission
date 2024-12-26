
import { Server } from "socket.io";
import socketHandler from './sockets/index.js';

const PORT = 3005;
const io = new Server({
    cors: {
        origin: "*",  
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    socketHandler(socket, io);
});

io.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})