const answerCall = async (io,ongoincall)=>{
   console.log('dentro server answerCall',ongoincall) 
   //si caller existe y socket.id !== participants.caller
     if(ongoincall.participants.caller){      
        io.to(ongoincall.participants.caller).emit('answerCall',ongoincall)
    }
}
export default answerCall