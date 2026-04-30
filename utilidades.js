/**
 * FUNCIÓN IMPRIMIR
 */
function imprimir(mensaje, velocidad = velocidadTexto) {
    return new Promise((resolve) => {
        if (procesoInterrumpido) {
            resolve();
            return;
        }

        const p = document.createElement('p');
        pantallaContenido.appendChild(p);
        
        let i = 0;
        function escribir() {
            if (procesoInterrumpido) {
                resolve();
                return;
            }

            if (i < mensaje.length) {
                p.textContent += mensaje.charAt(i);
                i++;
                let t = setTimeout(escribir, velocidad);
                timeoutsActivos.push(t);
            } else {
                pantallaScroll.scrollTop = pantallaScroll.scrollHeight;
                resolve(); // Termina la promesa cuando el texto termina
            }
        }
        escribir();
    });
}

/**
 * FUNCION PAUSA
 */
const pausa = (ms) => new Promise(res => setTimeout(res, ms));

/**
 * FUNCION DETENER
 */
function detenerTodoElTexto() {
    procesoInterrumpido = true;
    timeoutsActivos.forEach(t => clearTimeout(t));
    timeoutsActivos = [];
}

/**
 * FUNCION MOSTRAR BOTON DE OPCIONES
 */
function mostraropcion(mensaje, fn, opt = undefined){
  const btn = document.createElement('div');
  btn.className = "opcion-terminal";
  btn.textContent = "["+mensaje+"]";
  btn.onclick = () => {
    if (opt === undefined) {
      fn(); 
    } else {
      fn(opt); 
    }
  };
  pantallaContenido.appendChild(btn);
}

/**
 * FUNCION TIRAR DADO
 */
function tirarDadoMedio(stat) {
    const dado = Math.floor(Math.random() * 6) + 1;
    const valorStat = jugador.clase[stat];
    return { exito: dado <= valorStat, resultado: dado, valor: valorStat };
}
function tirarDadoDificil(stat) {
    const dado = Math.floor(Math.random() * 9) + 1;
    const valorStat = jugador.clase[stat];
    return { exito: dado <= valorStat, resultado: dado, valor: valorStat };
}
function tirarDadoFacil(stat) {
    const dado = Math.floor(Math.random() * 3) + 1;
    const valorStat = jugador.clase[stat];
    return { exito: dado <= valorStat, resultado: dado, valor: valorStat };
}


/**
 * FUNCIÓN GLOBAL: RECIBIR DAÑO
 * Resta vida o cordura y actualiza la interfaz.
 */
function recibirDaño(fisico, mental) {
    // 1. Restamos los valores al objeto jugador
    jugador.clase.salud_fisica -= fisico;
    jugador.clase.salud_mental -= mental;

    // 2. Actualizamos el panel lateral para que el cambio se vea reflejado
    actualizarPanelInfo(jugador.clase);
    imprimir(`Has recibido ${fisico} daño físico y ${mental} daño mental.`, 30);

    // 3. Verificamos si el investigador ha muerto o enloquecido
    if (jugador.clase.salud_fisica <= 0 || jugador.clase.salud_mental <= 0) {
        finalizarPartida();
    }
}

/**
 * FUNCIÓN GLOBAL: FINALIZAR PARTIDA
 * Detiene el juego cuando el jugador pierde.
 */
async function finalizarPartida() {
    detenerTodoElTexto(); // Detenemos cualquier escritura en curso
    pantallaContenido.innerHTML = ""; // Limpiamos la pantalla
    
    await imprimir("--- EL INVESTIGADOR HA CAÍDO ---", 50);
    
    if (jugador.clase.salud_fisica <= 0) {
        await imprimir("Tus heridas son demasiado graves. La oscuridad te reclama mientras tu cuerpo cede finalmente al dolor.", 30);
    } else {
        await imprimir("Tu mente se ha fracturado irremediablemente. Ahora solo ves sombras y escuchas cánticos en idiomas que ningún humano debería conocer.", 30);
    }

    await pausa(2000);
    await imprimir("TU AVENTURA EN ARKHAM TERMINA AQUÍ.", 40);
    
    // Creamos un botón de reinicio simple
    const btn = document.createElement('div');
    btn.className = "opcion-terminal";
    btn.textContent = "[ REINTENTAR ]";
    btn.onclick = () => location.reload(); // Recarga la página
    pantallaContenido.appendChild(btn);
}

function limpiarPantalla() {
    detenerTodoElTexto(); // Detiene los timeouts activos
    procesoInterrumpido = false; // Reseteamos el flag para poder volver a escribir
    pantallaContenido.innerHTML = ""; // Limpia el DOM
}