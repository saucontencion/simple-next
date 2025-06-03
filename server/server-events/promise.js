const clasPromise = (msg, error) => new Promise((resolve, reject) => {
    if (error) {
        reject(error); // Rechaza con el mensaje de error
    } else {
        resolve(msg); // Resuelve con el mensaje
    }
});

clasPromise("Todo salió bien", false)
    .then(msg => console.log("Éxito:", msg))
    .catch(err => console.log("Error:", err));

clasPromise("Este salio mal",'aqui hay un error')
    .then(msg => console.log("Éxito:", msg))
    .catch(err => console.log("Error:", err));
