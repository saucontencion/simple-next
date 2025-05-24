let webrtcSignal = (io,data)=>{
    console.log('webrtc data',data)
    if (data.participants.caller) {
        io.to(data.participants.caller).emit('webrtcSignal',data)
    }
    io.to(data.participants.receiver).emit('webrtcSignal',data)
    // webrtcSignal el objeto dataSignal, con data, participantes, initiator
} ;
export default webrtcSignal