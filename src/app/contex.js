
import { useCallback, useContext, useEffect, useState,useRef } from "react";
import { createContext } from "react";
import Peer from 'simple-peer';
import { io } from "socket.io-client";


export const PeerContext = createContext(null);

export const ContextProvider = (props) => {
  const [peer,setPeer] = useState(null);

  const [socket, setSocket] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [sdp,setSdp]= useState(null)

  const peerRef = useRef(null);
  const sdpRef = useRef(null);
  const socketRef = useRef(null)
  
  const inicializarPeer = useCallback((initiator) => {
    
    console.log('og');
    const p = new Peer({
      initiator,
      trickle: false
    })
    
    p.on('error', err => console.log('error', err))
      
    p.on('signal', data => { //el que tenga el initiator en true lo comienza
      console.log('SIGNAL', JSON.stringify(data))
      // el escribir va a ser el socket emit(webrtcSignal o guardar el sdp no mas)
      let signalpre = JSON.stringify(data);
      let dataSignal = signalpre.slice(0)
      setSdp(dataSignal)
      sdpRef.current = dataSignal
      if (socketRef.current) {
        console.log('emitiendo webrtcsignal');
        socketRef.current.emit('webrtcSignal', sdpRef.current)
      }
      
    })
    
    p.on('connect', () => {
      console.log('CONNECT'
        //aqui el of peer onwebrtcsignal
      )
      p.send('whatever' + Math.random())
    })
    
    p.on('data', data => {
      console.log('data: ' + data)
    })
    
    setPeer(p)
    peerRef.current = p
  
  //emitir pee.signal y emitir socket.emit(webrtcSignal)
  }, [peer,socket,sdp]);

  const emitSignal = useCallback(() => {
      if(!peerRef.current){
        inicializarPeer(true)
        return
      }
      peerRef.current.signal(sdpRef.current)

      //aqui deberia ir pero sdp.current esta vacio, poner el peer en use effect no mas
  }, []);

    // initialize socket
    useEffect(() => {
        const initializeSocket = async () => {
            const socketInstance = await io();
            setSocket(socketInstance);
            socketRef.current=socketInstance
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

        return () => {
            if (socket) {
                socket.off("connect", onConnect);
                socket.off("disconnect", onDisconnect);
            }
        };
    }, [socket, isSocketConnected]);

  return (
    <PeerContext.Provider
        value={{
            peer,
            socket,
            emitSignal,
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