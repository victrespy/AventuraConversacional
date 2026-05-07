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
async function recibirDaño(fisico, mental) {
    //Si el jugador tiene abrigo de cuero no sufre daño físico, si tiene amuleto de jade no sufre daño mental
    if (jugador.inventario.includes("Abrigo de cuero") && fisico > 0) {
        fisico = 0;
        await imprimir("Tu abrigo de cuero te protege del daño físico, pero despues de esto ha quedado inservible.", 30);
        jugador.inventario = jugador.inventario.filter(item => item !== "Abrigo de cuero");
        renderizarInventario();
    }
    if (jugador.inventario.includes("Amuleto") && mental > 0) {
        mental = 0;
        await imprimir("Tu amuleto te protege de la locura.", 30);
        jugador.inventario = jugador.inventario.filter(item => item !== "Amuleto");
        renderizarInventario();
    }
    await pausa(500); 

    // 1. Restamos los valores al objeto jugador
    jugador.clase.salud_fisica -= fisico;
    jugador.clase.salud_mental -= mental;

    // 2. Actualizamos el panel lateral para que el cambio se vea reflejado
    actualizarPanelInfo(jugador.clase);
    if (fisico > 0 && mental > 0) {
        await imprimir(`Has recibido ${fisico} daño físico y ${mental} daño mental.`, 30);
    } else if (fisico > 0) {
        await imprimir(`Has recibido ${fisico} daño físico.`, 30);
    } else if (mental > 0) {
        await imprimir(`Has recibido ${mental} daño mental.`, 30);
    }
    
    // 3. Verificamos si el investigador ha muerto o enloquecido
    if (jugador.clase.salud_fisica <= 0 || jugador.clase.salud_mental <= 0) {
        await finalizarPartida();
    }
    await pausa(500);
}

/**
 * FUNCIÓN GLOBAL: FINALIZAR PARTIDA
 * Detiene el juego cuando el jugador pierde.
 */
async function finalizarPartida() {
    detenerTodoElTexto();
    pantallaContenido.innerHTML = "";
    
    await imprimir("EL INVESTIGADOR HA SUCUMBIDO.", 60);
    await pausa(1000);
    
    if (jugador.clase.salud_fisica <= 0) {
        await imprimir("Tu cuerpo, roto y desgarrado por fuerzas que no comprendes, finalmente se desploma sobre la fría piedra.");
        await imprimir("La sangre se enfría rápidamente mientras las sombras se acercan para reclamar lo que queda de ti.");
    } else {
        await imprimir("La última barrera de tu cordura se quiebra con un sonido seco. Las visiones de los mundos exteriores inundan tu mente, borrando quién eras.");
        await imprimir("Ahora solo eres una carcasa vacía que ríe entre dientes, adorando a los mismos monstruos que intentaste detener.");
    }

    await pausa(2000);
    await imprimir("LA ORDEN DE YOG-SOTHOTH HA TRIUNFADO.", 50);
    
    mostraropcion("VOLVER A INTENTARLO", () => location.reload());
}

function limpiarPantalla() {
    detenerTodoElTexto(); // Detiene los timeouts activos
    procesoInterrumpido = false; // Reseteamos el flag para poder volver a escribir
    pantallaContenido.innerHTML = ""; // Limpia el DOM
}