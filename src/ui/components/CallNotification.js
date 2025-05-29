'use client'
import { useContextHook } from "@/app/contex"

function CallNotification() {
    const {ongoingCall, handleJoinCall, handleHungup,} = useContextHook()
    if(!ongoingCall?.isRinging) return
  return (
    <div className="absolute" >
    <div className="bg-white p-4 rounded shadow-lg">
        <div  className="flex items-center space-x-4 p-2 border-b border-gray-200">
        </div>
        <p className="text-lg font-semibold">Someone is calling...</p>
        <div className="flex justify-end mt-4">
            <button onClick={() => { 
                console.log('call notoficaction llamando a handleJoinCall con ongoingcall',ongoingCall);
                handleJoinCall(ongoingCall)}} className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600">
                Accept
            </button>
            <button  onClick={()=>handleHungup({ongoingCall: ongoingCall ? ongoingCall: undefined, isEmitHangup: true})} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" >
                Decline
            </button>
        </div>
    </div>
    </div>
  )
}

export default CallNotification
