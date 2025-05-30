let webrtcSignal = (io,data)=>{
    console.log('webrtc data',data)
    if (data.ongoingCall.caller &&data.isCaller) {
        io.to(data.ongoingCall.caller).emit('webrtcSignal',data)
    }
    io.to(data.ongoingCall.receiver).emit('webrtcSignal',data)
    // webrtcSignal el objeto dataSignal, con data, participantes, initiator
} ;
export default webrtcSignal