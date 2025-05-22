import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

import onWebrtcSignal from "./server-events/onWebrtcSignal.js";

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

  io.on("connection", (socket) => {
    console.log('conectado cliente al serverSocketIo');
    
    socket.on('webrtcSignal',(data)=> {
      console.log('en server webrtcsignal'); 
      onWebrtcSignal(io, data)
      setTimeout(()=> socket.emit('webrtcSignal','datos data'),2000)
      }
    );
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