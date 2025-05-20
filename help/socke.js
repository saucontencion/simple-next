import { useCallback, useContext, useEffect, useState, useRef } from "react";
import { createContext } from "react";
import Peer from 'simple-peer';
import { io } from "socket.io-client";

export const PeerContext = createContext(null);

export const ContextProvider = (props) => {
  const [peer, setPeer] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [sdp, setSdp] = useState(null);
  
  const peerRef = useRef(null);
  const sdpRef = useRef(null);
  const socketRef = useRef(null);
  
  const inicializarPeer = useCallback((initiator) => {
    console.log('Initializing peer with initiator:', initiator);
    
    const p = new Peer({
      initiator,
      trickle: false
    });
    
    p.on('error', err => console.log('error', err));
    
    p.on('signal', data => {
      console.log('SIGNAL', JSON.stringify(data));
      let signalData = JSON.stringify(data);// si me sale la señal el error data => slice(0)
      setSdp(signalData);
      sdpRef.current = signalData;
      
      // Only emit the signal if socket is connected
      if (socketRef.current) {
        console.log('Emitting WebRTC signal');
        socketRef.current.emit('werbrtcSignal', signalData);
      }
    });
    
    p.on('connect', () => {
      console.log('CONNECT');
      p.send('whatever' + Math.random());
    });
    
    p.on('data', data => {
      console.log('data: ' + data);
    });
    
    setPeer(p);
    peerRef.current = p;
  }, []);
  
  const emitSignal = useCallback(() => {
    console.log('emitSignal sdp', sdp);
    console.log('peer type:', typeof(peer));
    console.log('peer object:', peer);
    
    if (!peerRef.current) {
      console.log('No peer available, initializing one');
      inicializarPeer(true);
      // Don't call emitSignal recursively here - let useEffect handle it
      return;
    }
    
    if (sdpRef.current) {
      console.log('Signaling with:', sdpRef.current);
      peerRef.current.signal(sdpRef.current);
    } else {
      console.warn('No SDP available for signaling');
    }
  }, [inicializarPeer, peer, sdp]);
  
  // Handle incoming WebRTC signals
  useEffect(() => {
    if (socket && isSocketConnected) {
      socket.on('werbrtcSignal', (incomingSignal) => {
        console.log('Received WebRTC signal', incomingSignal);
        sdpRef.current = incomingSignal;
        
        if (!peerRef.current) {
          log( 'en el useeffect peerref no existe', peerRef.current)
          // If we don't have a peer yet, create one as non-initiator
          inicializarPeer(false);
        } else {
          // Otherwise signal the existing peer
          peerRef.current.signal(incomingSignal);
        }
      });
      
      return () => {
        socket.off('werbrtcSignal');
      };
    }
  }, [socket, isSocketConnected, inicializarPeer]);
  
  // Initialize socket
  useEffect(() => {
    const initializeSocket = async () => {
      const socketInstance = io();
      setSocket(socketInstance);
      socketRef.current = socketInstance;
    };
    
    if (!socket) {
      initializeSocket();
    }
    
    if (socket && !isSocketConnected) {
      socket.connect();
    }
    
    const onConnect = () => {
      setIsSocketConnected(true);
      console.log("CONNECTED TO SOCKET");
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
        isSocketConnected,
        emitSignal,
        inicializarPeer,
      }}
      {...props}
    />
  );
};

export const useContextHook = () => {
  const context = useContext(PeerContext);
  if (!context) {
    throw new Error('useContextHook must be used within a ContextProvider');
  }
  return context;
};