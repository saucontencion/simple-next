let webrtcSignal = (io,socket,data)=>{
    console.log('webrtc data',socket.id)
    setTimeout(()=>{
        if (socket.id == data.ongoingCall.participants.caller) {
            io.to(data.ongoingCall.participants.reciver).emit('webrtcSignal',data)
            return
        }
        io.to(data.ongoingCall.participants.caller).emit('webrtcSignal',data)
    },1000)
} ;
export default webrtcSignal