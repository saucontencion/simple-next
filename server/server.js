import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import onCall from "./server-events/onCall.js";
import onWebrtcSignal from "./server-events/onWebrtcSignal.js";
import onHangup from "./server-events/onHangup.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
console.log('servidor corriendo')
app.prepare().then(() => {
  const httpServer = createServer(handler);

  let io = new Server(httpServer);
  let onlineUsers = []

  io.on("connection", (socket) => {
    console.log('conectado cliente al server');
    
    socket.on('addNewUser',(clerkkUser,isSocketConnected)=>{      
      clerkkUser && !onlineUsers.some(user => user?.userId == clerkkUser.id) &&isSocketConnected&& onlineUsers.push({
        userId: clerkkUser.id,
        socketId: socket.id,
        profile: clerkkUser
      })
      console.log('is socket connect en addnewuser',isSocketConnected);
      
      if (!isSocketConnected) {
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
        console.log('dentro del if addnew user !iscocket ');
        
      }
      io.emit('getUsers',onlineUsers)
    })
    socket.on('disconnect',()=>{
      console.log('socketid disconect' ,socket.id);
   
      onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
      io.emit('getUsers',onlineUsers)
    })
    //call events
    socket.on('call',(participants) => {
      onCall(io, participants);
    })
    socket.on('webrtcSignal',(data)=> onWebrtcSignal(io, data));
    socket.on('DlistUser',()=>{
      onlineUsers = []
      io.emit('DlistUser','listo papu')
    })
    socket.on('removeUser', (data) => {
      // Usar data.userId o data.socketId para identificar al usuario a remover.
      onlineUsers = onlineUsers.filter(user => user.userId !== data.userId);
      io.emit('getUsers', onlineUsers);
    });
    socket.on('hangup',(data)=>{
      onHangup(io, data)
    })
    
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});