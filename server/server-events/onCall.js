const onCall = async (io,participants)=>{
   console.log('dentro server Oncall',participants) 
/*     if(participants.reciver.socketId ){
        console.log(participants.caller.socketId);
        console.log(participants.reciver.socketId);
        
        io.to(participants.reciver.socketId).emit('incommingCall',participants)
    } */
}
export default onCall