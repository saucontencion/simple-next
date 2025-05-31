const pasarAlSgtCallStack = new Promise((resolve) => {
  resolve((io, socket, data) => {
    if (socket.id === data.ongoingCall.participants.caller) {
      io.to(data.ongoingCall.participants.reciver).emit('webrtcSignal', data);
    } else {
      io.to(data.ongoingCall.participants.caller).emit('webrtcSignal', data);
    }
  });
});

let webrtcSignal = (io, socket, data) => {
  pasarAlSgtCallStack.then((callback) => {
    callback(io, socket, data);
  });
};

export default webrtcSignal;
