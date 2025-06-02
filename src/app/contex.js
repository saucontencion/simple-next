
import { useCallback, useContext, useEffect, useState,useRef } from "react";
import { createContext } from "react";
import Peer from 'simple-peer';
import { io } from "socket.io-client";


export const PeerContext = createContext(null);

export const ContextProvider = (props) => {
  const [peer,setPeer] = useState(null);

  const [socket, setSocket] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [sdp, setSdp]= useState(null);
  const [onlineUsers,setOnlineUsers]= useState(null);
  const [peerOnData, setPeerOnData] = useState([]);
  const [calledEnd,setCalledEnd] =useState(true)
  const [ongoingCall,setongoingCall]=useState(null)
  const peerRef = useRef(null);
  const sdpRef = useRef(null);
  const socketRef = useRef(null);
  const participantesRef= useRef(null);
  const initiatorRef = useRef(false);
  const setongoingCallRef= useRef(null)
  const isCallerRef =useRef(false)

  const inicializarPeer = useCallback((initiator) => {
    
    console.log('og');
    const p = new Peer({initiator,trickle: false})
    
    p.on('error', err => console.log('error', err))
      
    p.on('signal', data => { 
      console.log('SIGNAL', JSON.stringify(data))
      let signalpre = JSON.stringify(data);
      let dataSignal = signalpre.slice(0)
      let extracParticipants = initiator
            ? { receiver: socketRef.current.id }
            : { caller: socketRef.current.id };
      setSdp(dataSignal)
      sdpRef.current = dataSignal;
      if (socketRef.current) {
        console.log('emitiendo webrtcsignal');
        const data = {
          sdp: sdpRef.current,
          ongoingCall: {...setongoingCallRef.current,isCaller:isCallerRef}
        };
        socketRef.current.emit('webrtcSignal', data);
      }  
    })
    
    p.on('connect', () => {
      console.log('Peer CONNECT,se desactivara la escucha de socket webrtc');
      if (socket) {socket.off('webrtcSignal')}
      p.send('whatever' + Math.random())
    })
    
    p.on('data', data => {
      console.log('data: ' + data)
      setPeerOnData(prev => [...prev, { sender: 'remote', text: data.toString() }]);
    })
    
    setPeer(p)
    peerRef.current = p
    }, [peer,socket,sdp]);

  const emitSignal = useCallback((initiator) => {
      if(!peerRef.current){
        initiatorRef.current= initiator;
        inicializarPeer(initiator)
        return
      }
      peerRef.current.signal(sdpRef.current)
    }, []);

    //emit p.data
    const emitPData =useCallback((mensaje)=>{
      peerRef.current.send(mensaje);
      setPeerOnData(prev => [...prev, { sender: 'yo', text: mensaje }]);
    },[])
    //onlineUser contendra sokcetId
    const handleCall = useCallback((onlineUser)=>{
        setCalledEnd(false)        
        if (!socketRef.current) return;      
        const participants = { caller: socketRef.current.id, reciver: onlineUser.socketId };
        setongoingCallRef.current={ participants, isRinging: false }
        socketRef.current?.emit('call', participants);
    },[]);
    const onInComingCall = useCallback((participants)=>{
        setongoingCallRef.current={ participants, isRinging: true }
        setongoingCall({ participants, isRinging: true })
    },[ongoingCall])
    const handleJoinCall =useCallback((ongoingCall)=>{
      setongoingCallRef.current={ ...ongoingCall, isRinging: false }
      setongoingCall({ ...ongoingCall, isRinging: false })
      socketRef.current.emit('answerCall', ongoingCall)// recive, y ahora emit a caller      
    },[])
    const onAnswerCall =useCallback((ongoingCall)=>{
      isCallerRef.current=true
      setongoingCallRef.current= {...ongoingCall,isCaller:isCallerRef}
      emitSignal(true)
    },[])

    // initialize socket
    useEffect(() => {
        const initializeSocket = async () => {
            const socketInstance = io();
            console.log('seteando socket' ,socketInstance);
            
            socketRef.current=socketInstance
            setSocket(socketInstance);
        };

        if (!socketRef.current) {
            initializeSocket();
        }

        if (socket && !isSocketConnected) {
            socket.connect();
        }


        const onConnect = () => {
            setIsSocketConnected(true);
            console.log("CONNECTED AL SOCKET");
        };

        const onDisconnect = () => {
            setIsSocketConnected(false);
            console.log("DISCONNECTED");
        };
        
        if (socket) {
          socket.on("connect", onConnect);
          socket.on("disconnect", onDisconnect);
        }
        if (socketRef.current.connected) {
          console.log("⚡ Chrome: conexión síncrona detectada");
          socketRef.current.on("connectE", onConnect());
            // Emitir el evento manualmente o llamar la función directamente
            socketRef.current.emit("connectE"); // Forzar el evento
        }
          
          return () => {
            if (socket) {
              socket.off("connect", onConnect);
              socket.off("disconnect", onDisconnect);
            }
        };
    }, [socket, isSocketConnected]);

    // Handle incoming WebRTC signals
    useEffect(() => {
      console.log('se activo handle incoming');
      
      if (socket && isSocketConnected) {
        socket.on('webrtcSignal', (incomingSignal) => {
          console.log('Received WebRTC signal', incomingSignal);
          sdpRef.current = incomingSignal.sdp;
          participantesRef.current= incomingSignal.participants
          if (!peerRef.current) {
            console.log( 'en el useeffect peerref no existe', peerRef.current)// If we don't have a peer yet, create one as non-initiator
            inicializarPeer(false);
            setTimeout(() => {
                    peerRef.current.signal(incomingSignal.sdp);  
            }, 1000);
          } else { // Otherwise signal the existing peer
            peerRef.current.signal(incomingSignal.sdp);
          }
        });
        
        return () => {
          socket.off('webrtcSignal');
        };
      }
    }, [socket, isSocketConnected]);

    //set onlineUsers
      useEffect(() => {
      if (!socket || !isSocketConnected ) return;
      socket.emit('addNewUser', socketRef.current.id, isSocketConnected);
      socket.on('getUsers', (res) => {
          console.log('Res de getUsers: que sera Online users', res);
          setOnlineUsers(res);
      });

      return () => {
          setOnlineUsers(null)
          socket.off('getUsers');
      };
  }, [socket, isSocketConnected]);

    // Handle Call
    useEffect(()=>{
      if (socket && isSocketConnected) {
        socket.on('call',()=>{

        })
      }
    },[socket, isSocketConnected])

    // calls
    useEffect(() => {
        if (!socket || !isSocketConnected) return;

        socket.on('incommingCall', onInComingCall);
        socket.on('answerCall',onAnswerCall);   
        
        return () => {
          socket.off('incommingCall', onInComingCall);
          socket.off('answerCall',onAnswerCall);   
        }
    }, [socket, isSocketConnected]);

    useEffect(() => {
        let timeout;
        if (calledEnd) {
            timeout = setTimeout(() => {
                setCalledEnd(false);
            }, 2000);
        }
        
        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [calledEnd]);

  return (
    <PeerContext.Provider
        value={{
            socket,
            peerOnData,
            onlineUsers,
            ongoingCall,
            emitPData,
            handleCall,
            handleJoinCall,
        }}
        {...props}
    />
  );
}

export const useContextHook = () => {
    const context = useContext(PeerContext);
    if (!context) {
        throw new Error('useSocket debe utilizar dentro de un socketprovider');
    }
    return context;
}