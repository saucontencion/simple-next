'use client'
import { useState } from 'react';
import {useContextHook} from '../../app/contex';

export default function Chat() {
  const {emitPData,peerOnData} = useContextHook();
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    emitPData(input); // enviar por WebRTC
    setInput('');

    // Agrega tu mensaje y una respuesta simulada
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '400px' }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Escribe un mensaje..."
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />

      <button onClick={handleSend}>Enviar</button>
      <div style={{ border: '1px solid #ccc', padding: '0.5rem', height: '200px', overflowY: 'auto', marginBottom: '0.5rem' }}>
      {peerOnData.map((msg, i) => (
        <div key={i}>
          <strong>{msg.sender}:</strong> {msg.text}
        </div>
      ))
}

      </div>

    </div>
  );
}
