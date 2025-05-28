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
        - [✔] emitir al par un mensaje
            - [✔] initilizeSocket: 
                - [✔] agregar parametro true o false a emitirsignal
                - [✔] Crear usseffect escucha de webrtcSignal (ON Y OFF LISTO)
                    - [✔] Evaluar: // Handle incoming WebRTC signals 
        - [✔] Emit webrtcSignal desde server events
            - [O] Colocar lo de participantes para rederigir
                - [O] caller y reciver se esten guardando correctamente
6. -[O] list user y call
    -[✔] crear la lista de usuarios en el servidor y emitirla
    -[✔] //set onlineUsers, recibir la lista de usuarios,
    -[✔] Crear el elemento lista de ususario con onlineusers 
        -[✔] se llama a handle call con onlineUse
        -[✔] crear el handle call y socket.emit('call, participants)
        -[O] server events onCall emit incommingCall
    - [] crear la notificacion , la notificacion llama a handleJoinCall, la cual ejecuta socket.emit('answerCall', {from:user})
    -[] socket on('answerCall',()=> emit signal(true)) <!-- despues la maneja socket.on('webrtcSignal ) -->


    -[] hay tendria a quien se esta llamando y ejecutar todo como esta hasta ahora 
// yo hacer todo el show de de lista usuarios, llamada,notificacion,contestacion         
            
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

