
import { useCallback, useContext, useEffect, useState } from "react";
import { createContext } from "react";
import Peer from 'simple-peer'


export const PeerContext = createContext(null);

export const ContextProvider = (props) => {
  const [peer,setPeer] = useState();
  //que se ejecute al iniciar la pagina
   useEffect(()=>{
    
    const p = new Peer({
      initiator: location.hash === '#1',
      trickle: false
    })
    
    p.on('error', err => console.log('error', err))
    
    p.on('signal', data => { //el que tenga el initiator en true lo comienza
      console.log('SIGNAL', JSON.stringify(data))
      document.querySelector('#outgoing').textContent = JSON.stringify(data)
    })
    //  yo copio lo que sale de data y lo paso a signal
    document.querySelector('form').addEventListener('submit', ev => {
      ev.preventDefault()
      p.signal(JSON.parse(document.querySelector('#incoming').value))
    })
    
    p.on('connect', () => {
      console.log('CONNECT')
      p.send('whatever' + Math.random())
    })
    
    p.on('data', data => {
      console.log('data: ' + data)
    })
    
    setPeer(p)
  },[])

  return (
    <PeerContext.Provider
        value={{
            peer,
        }}
        {...props}
    />
  );
}

export const usePeer = () => {
    const context = useContext(PeerContext);
    if (!context) {
        throw new Error('useSocket debe utilizar dentro de un socketprovider');
    }
    return context;
}