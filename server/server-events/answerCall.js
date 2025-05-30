const answerCall = async (io,participants)=>{
   console.log('dentro server answerCall',participants) 
     if(participants.caller ){
        io.to(participants.caller).emit('answerCall',participants)
    }
}
export default answerCall