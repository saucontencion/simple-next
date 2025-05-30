import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

import onWebrtcSignal from "./server-events/onWebrtcSignal.js";
import onCall from "./server-events/onCall.js";
import answerCall from "./server-events/answerCall.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
console.log('servidor corriendo')
app.prepare().then(() => {
  const httpServer = createServer(handler);
//anclar el socket al httpServer
  let ServerSocketIo = Server
  let io = new ServerSocketIo(httpServer);
  let onlineUsers = []

  io.on("connection", (socket) => {
    console.log('conectado cliente al serverSocketIo');
    
    socket.on('addNewUser',(socketId,isSocketConnected)=>{      
      socketId && !onlineUsers.some(user => user == socketId.id) &&isSocketConnected&& onlineUsers.push({
        socketId})      
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
    socket.on('webrtcSignal',(data)=> {
      console.log('en server webrtcsignal'); 
      onWebrtcSignal(io,socket, data)
/*       setTimeout(()=> socket.broadcast.emit('webrtcSignal',data),1000)
 *//*       setTimeout(()=> socket.broadcast.emit('webrtcSignal',data),2000)
 */      }
    );
    socket.on('call',(participants) => {
      onCall(io, participants);
    })
    socket.on('answerCall',(participants) => {
      answerCall(io, participants);
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