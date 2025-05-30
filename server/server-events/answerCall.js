const answerCall = async (io,ongoincall)=>{
   console.log('dentro server answerCall',ongoincall) 
   console.log('dentro server answerCall',ongoincall.caller) 
   //si caller existe y socket.id !== participants.caller
     if(ongoincall.participants.caller){
      console.log('dentro del if con del seerver answwecall',ongoincall);
      
        io.to(ongoincall.participants.caller).emit('answerCall',ongoincall)
    }
}
export default answerCall