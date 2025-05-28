'use client'
import { useContextHook } from "../../app/contex"

const ListOnlineUsers=()=>{
    const {onlineUsers,handleCall,socket} = useContextHook()
    return (<>
        {onlineUsers && onlineUsers?.length>0 && onlineUsers?.map(onlineUser =>{ 
            if(onlineUser.socketId == socket?.id) return null
            return <div key={onlineUser.socketId} onClick={()=> handleCall(onlineUser)} className="flex items-center space-x-4 p-2 border-b border-gray-200"> 
                <div>{onlineUser.socketId}</div>
                <div>aqui estoy</div>
            </div>
        })}
    </>)
}

export default ListOnlineUsers