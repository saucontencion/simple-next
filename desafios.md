### inconsistentes entre navegadores con Socket.IO.
Los problemas identificados:

Timing de conexión diferente entre navegadores:

Chrome puede conectarse sincrónamente al crear la instancia
Brave puede conectarse asincrónamente después


Event listeners configurados tarde:

Si Chrome se conecta antes de configurar el listener onConnect, nunca se ejecuta


Dependencias del useEffect causan re-renders:

[socket, isSocketConnected] hace que se ejecute múltiples veces