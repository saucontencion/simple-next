1. [✔] Crear un servidor HTTP con Node.js para alojar Next.js y Socket.io.
    - [✔] Estructura

2. [✔] Configurar Next.js para ejecutarse en el servidor HTTP personalizado.
3. [✔] Integrar Socket.io en el servidor HTTP.
4. [✔] Implementar eventos de servidor en Socket.io.
5. [O] Implementar la lógica de conexión y eventos en el contexto.
    - [✔] inicializar el socket
    - [✔] emitir los primeros eventos en el socket 
        - [✔] el emitSignal,atomicida, uso de useRef para inmediates y socket.emit prueba
    - [✔] Recibir werbrtcSignal en el server
        - [✔] socket emit hasta onwebrtcSignal.js
        - [O] emitir al par un mensaje
            - [O] initilizeSocket: 
                - [✔] agregar parametro true o false a emitirsignal
                - [✔] Crear usseffect escucha de webrtcSignal (ON Y OFF LISTO)
                    - [✔] Evaluar: // Handle incoming WebRTC signals 
                - [o] Emit webrtcSignal desde server events
                    - [O] Colocar lo de participantes para rederigir
                        - [O] caller y reciver se esten guardando correctamente
            -[] onwebrtcSignal: implementar lo de sock para manejo de dataSignal
            -[]crear el objeto dataSignal, con data, participantes, initiator
            -[] manejar el dataSignal en on webrtcSginal
            -[] probar recepcion
    - [] Implementar socket// peer.on('connect,()={ socket.of('werbrtcSignal')})
6. [ ] Diseñar la interfaz de usuario para interactuar con los eventos de Socket.io.
7. [ ] Probar la comunicación en tiempo real entre cliente y servidor.

9. [] Implementr eventos personalizado en el server
8. [ ] Documentar el proceso de configuración e implementación.
9. [ ] Realizar pruebas finales y ajustes necesarios.

