// 1. DEFINICIÓN DE LOS PERSONAJES
const personajes = {
    "roland": {
        nombre: "Roland Banks",
        voluntad: 3, inteligencia: 3, fuerza: 4, agilidad: 2,
        salud_fisica: 9, salud_mental: 5,
        objeto_inicial: "Pistola",
        descripcion: "A Roland siempre le habían reconfortado los procedimientos y las reglas. Como agente del FBI, le alivia tener unas directrices que poder seguir en cualquier situación. Pero últimamente, el manual de agentes del FBI había resultado completamente inútil en los casos que le habían asignado."
    },
    "daisy": {
        nombre: "Daisy Walker",
        voluntad: 3, inteligencia: 5, fuerza: 2, agilidad: 2,
        salud_fisica: 5, salud_mental: 9,
        objeto_inicial: "Lupa",
        descripcion: "Daisy es una respetada bibliotecaria de la Universidad Miskatonic que siempre había sentido que los libros eran lo más importante en su vida. Exploraba en la ficción lo que aborrecía en la vida real: horror, violencia, miedo."
    },
    "malasombra": {
        nombre: "Malasombre O'Toole",
        voluntad: 2, inteligencia: 3, fuerza: 3, agilidad: 4,
        salud_fisica: 8, salud_mental: 6,
        objeto_inicial: "Bolsa de dinero",
        descripcion: "Entre los planes de vida de Malasombra no estaba delinquir. Pero a veces, hacer lo correcto supone ensuciarte las manos. A la poli le daba igual que Malasombra necesitara el dinero para la operación de su madre."
    }
};

let jugador = {
    clase: null,
    inventario: [],
    pistasActo2: {
        universidad: false,
        manicomio: false,
        muelles: false,
        anticuario: false
    }
};

// --- LÓGICA DE CONTROL ---
let timeoutsActivos = []; 
let procesoInterrumpido = false;
let velocidadTexto = 30;

const pantallaScroll = document.getElementById('pantalla'); 
const pantallaContenido = document.getElementById('contenido-pantalla'); 
const infoPanel = document.getElementById('info');


function elegirVelocidad() {
    return new Promise(async (resolve) => { 
        limpiarPantalla();
        
        await imprimir("Selecciona la velocidad de transmisión de datos:", 25);
        
        mostraropcion("RÁPIDO", () => {
            velocidadTexto = 10;
            resolve();
        });
        
        mostraropcion("MEDIO", () => {
            velocidadTexto = 30;
            resolve();
        });
        
        mostraropcion("LENTO", () => {
            velocidadTexto = 50;
            resolve();
        });
    });
}


async function presentarPersonajes() {
    const keys = Object.keys(personajes);
    for (const id of keys) {
        if (procesoInterrumpido) break;
        const p = personajes[id];
        
        await imprimir(`--- FICHA: ${p.nombre.toUpperCase()} ---`, 10);
        await imprimir(p.descripcion, 3);
        
        const btn = document.createElement('div');
        btn.className = "opcion-terminal";
        btn.innerHTML = `[ SELECCIONAR SUJETO: ${id.toUpperCase()} ]`;
        btn.style.marginBottom = "25px";
        btn.onclick = () => seleccionarInvestigador(id);
        pantallaContenido.appendChild(btn);
    }
}

async function seleccionarInvestigador(id) {
    detenerTodoElTexto();
    const p = personajes[id];
    jugador.clase = p;
    jugador.inventario = [p.objeto_inicial];
    limpiarPantalla();
    procesoInterrumpido = false; 
    
    actualizarPanelInfo(p);
    
    await imprimir(`SISTEMA: Identidad confirmada. Bienvenido, ${p.nombre}.`);
    await pausa(1000);
    inicioHistoria();
}

function actualizarPanelInfo(personaje) {
    infoPanel.classList.remove('oculto');
    infoPanel.innerHTML = "";
    const titulo = document.createElement('h2');
    titulo.textContent = personaje.nombre;
    infoPanel.appendChild(titulo);

    const statsContainer = document.createElement('div');
    statsContainer.className = "stats-container"; 
    statsContainer.innerHTML = `
        <div class="stats-principales">
            <p><strong>VOL:</strong> ${personaje.voluntad}</p>
            <p><strong>INT:</strong> ${personaje.inteligencia}</p>
            <p><strong>FUE:</strong> ${personaje.fuerza}</p>
            <p><strong>AGI:</strong> ${personaje.agilidad}</p>
        </div>
        <div class="stats-salud">
            <p style="color: #E23F76;"><strong>SALUD:</strong> ${personaje.salud_fisica}</p>
            <p style="color: #58a6ff;"><strong>CORDURA:</strong> ${personaje.salud_mental}</p>
        </div>
    `;
    infoPanel.appendChild(statsContainer);

    const invTitulo = document.createElement('h3');
    invTitulo.textContent = "INVENTARIO:";
    infoPanel.appendChild(invTitulo);

    const listaInv = document.createElement('div');
    listaInv.id = "lista-inventario";
    infoPanel.appendChild(listaInv);
    renderizarInventario();
}

function renderizarInventario() {
    const contenedorInv = document.getElementById('lista-inventario');
    if (!contenedorInv) return;
    contenedorInv.innerHTML = ""; 
    jugador.inventario.forEach(item => {
        const div = document.createElement('div');
        div.textContent = `> ${item}`;
        div.style.color = "#7ee787";
        contenedorInv.appendChild(div);
    });
}

// LANZAMIENTO INICIAL
async function init() {
    await elegirVelocidad(); 
    
    limpiarPantalla(); 
    
    await imprimir("SISTEMA DE ASIGNACIÓN DE ACTIVOS. Extrayendo archivos confidenciales...", 15);
    await pausa(1000); 
    presentarPersonajes(); 
}

init();

// --- HISTORIA ---
async function inicioHistoria() {
  limpiarPantalla();
  await imprimir("Has estado investigando los extraños sucesos que están teniendo lugar en tu ciudad natal de Arkham, en Massachusetts.");
  await pausa(500);
  await imprimir("Durante las últimas semanas, varios habitantes de la ciudad han desaparecido misteriosamente. Y hace poco aparecieron sus cadáveres en el bosque, medio devorados y salvajemente mutilados.");
  await pausa(500);
  await imprimir("La policía y los periódicos han dicho que ha sido obra de animales, pero crees que hay algo más en marcha.");
  await pausa(500);
  await imprimir("Has recibido una carta de un viejo amigo, el profesor Armitage, rogando tu ayuda inmediata.");
  await pausa(500);
  mostraropcion("CONTINUAR", acto1);
}






























































//=================================================================================================================================
// --- ACTO 1 ---
//=================================================================================================================================
async function acto1() {
    limpiarPantalla();
    await imprimir("ACTO 1: EL ENCUENTRO", 70);
    await pausa(500);
    await imprimir("La noche está muy avanzada. Estáis metidos en tu estudio, investigando las sangrientas desapariciones que han estado teniendo lugar en la región.");
    await pausa(500);
    await imprimir("Tras varias horas de investigación, oís un extraño cántico proveniente de la salita que hay al final del pasillo. Al mismo tiempo, se oye un movimiento de tierra, como si algo estuviera cavando bajo el suelo.");
    await pausa(500);
    await imprimir("Cuando vais a poneros en acción para investigar, la puerta del estudio se desvanece ante vuestros ojos, dejando sólo una pared sólida. Estáis atrapados en el estudio hasta que podáis encontrar otra forma de salir.");
    await pausa(500);
    mostraropcion("MIRAR ALREDEDOR", estudio);
}



//=============================================================
// --- ACTO 1: EL ESTUDIO ---
//=============================================================

// --- ESTADO ESPECÍFICO DEL ESTUDIO ---
let estadoEstudio = {
    visitasEstudio: 0,
    peligro: 0,
    PELIGRO_MAXIMO: 5,
    observoDetalles: false,
    cofreAbierto: false,
    llaveEncontrada: false,
    escritorioInvestigado: false,
    leerInformes: false,
    libreriaInvestigada: false,
    pistaAlfombra: false,
    alfombraApartada: false,
    desesperacionActiva: false
};

// --- FUNCIÓN PRINCIPAL: ESTUDIO ---
async function estudio() {
    limpiarPantalla();
    
    if (estadoEstudio.peligro >= estadoEstudio.PELIGRO_MAXIMO) {
        await eventoAleatorioPeligro();
        return;
    }

    // 1. Descripciones limitadas (máximo 3)
    estadoEstudio.visitasEstudio++;
    if (estadoEstudio.visitasEstudio === 1) {
        await imprimir("El estudio es una estancia opresiva. Un escritorio de roble domina el centro y las paredes están forradas de libros que parecen observaros.");
    } else if (estadoEstudio.visitasEstudio === 2) {
        await imprimir("El aire aquí se siente estancado. La alfombra del suelo amortigua vuestros pasos de forma antinatural. Y sigues en el mismo lugar, sin poder salir.");
    } else if (estadoEstudio.visitasEstudio === 3) {
        await imprimir("Volvéis a escudriñar la sala. Las sombras en las esquinas parecen haber cambiado de posición.");
    }

    if (estadoEstudio.peligro >= 3 && !estadoEstudio.desesperacionActiva) {
        estadoEstudio.desesperacionActiva = true;
        await imprimir("Sientes que algo invisible te está acechando. Cada vez que miras a tu alrededor, tienes la sensación de que algo se acerca un poco más.");
    }
    if (estadoEstudio.desesperacionActiva) {
        await imprimir("El sudor frío recorre tu nuca. La desesperación empieza a nublar tu juicio y te empuja a cometer locuras.");
    }

    // 2. Opciones Principales
    if (!estadoEstudio.observoDetalles) {
        mostraropcion("OBSERVAR CON DETENIMIENTO", observarEstudio);
    } else if (!estadoEstudio.cofreAbierto) {
        mostraropcion("INTERACTUAR CON EL COFRE", interactuarCofre);
    }

    mostraropcion("EXAMINAR EL ESCRITORIO", escenaEscritorio);
    mostraropcion("BUSCAR EN LA LIBRERÍA", escenaLibreria);

    // Acción de desesperación
    if (estadoEstudio.desesperacionActiva) {
        mostraropcion("DERRIBAR LA PARED", placajePared);
    }

    if (estadoEstudio.pistaAlfombra && !estadoEstudio.alfombraApartada) {
    mostraropcion("APARTAR LOS MUEBLES Y LA ALFOMBRA", apartarAlfombra);
}

if (estadoEstudio.alfombraApartada) {
    mostraropcion("ABRIR LA TRAMPILLA Y SALIR", intentarSalir);
}
}

async function eventoAleatorioPeligro() {
    estadoEstudio.peligro = 2; 
    limpiarPantalla();
    const eleccion = Math.floor(Math.random() * 2);

    if (eleccion === 0) {
        await imprimir("DE REPENTE:", 70);
        await imprimir("Un susurro inhumano llena la sala...");
        let prueba;
        if (jugador.inventario.includes("Relicario de plata")) {
            prueba = tirarDadoFacil("voluntad");
        } else {
            prueba = tirarDadoMedio("voluntad");
        }
        await pausa(1000);
        if (!prueba.exito) {
            await imprimir("...llenando tus oidos y penetrando en tu mente. El pánico te desborda.");
            await recibirDaño(0, 1);
        } else {
            await imprimir("...pero resistes el impulso de gritar y consigues taparte los oidos.");
        }
    } else {
        await imprimir("DE REPENTE:", 70);
        await imprimir("Una de las estanterías cede...");
        const prueba = tirarDadoMedio("agilidad");
        await pausa(1000);
        if (!prueba.exito) {
            await imprimir("...no logras verlo y el impacto te golpea con fuerza.");
            await recibirDaño(1, 0);
        } else {
            await imprimir("...pero te lanzas al suelo en el último segundo consiguiendo esquivarla.");
        }
    }
    await pausa(2000);
    await estudio();
}

// --- SUB-ESCENAS Y LÓGICA ---

async function observarEstudio() {
    limpiarPantalla();
    let prueba;
    if(jugador.inventario.includes("Lupa")){
        await imprimir("Usas la lupa para observar cada rincón del estudio con detenimiento...");
        prueba = tirarDadoFacil("inteligencia");
    } else if(!estadoEstudio.desesperacionActiva){
        await imprimir("Te tomas un momento para observar cada rincón del estudio con detenimiento...");
        prueba = tirarDadoMedio("inteligencia");
    } else {
        await imprimir("En tu estado de desesperación, intentas observar el estudio con detenimiento, pero tu mente nublada apenas puede concentrarse...");
        prueba = tirarDadoDificil("inteligencia");
    }
    await pausa(1000);
    if (prueba.exito) {
        await imprimir("Al fijarte en el hueco bajo el escritorio, descubres un pequeño cofre de hierro reforzado. Está cerrado con llave.");
        estadoEstudio.observoDetalles = true;
    } else {
        await imprimir("Te distraes con el tintineo de los cristales. No encuentras nada que llame tu atencion.");
        estadoEstudio.peligro++;
    }
    await pausa(500);
    mostraropcion("VOLVER", estudio);
}

async function interactuarCofre() {
    limpiarPantalla();
    estadoEstudio.peligro++;
    if (estadoEstudio.llaveEncontrada) {
        await imprimir("Usas la llave pequeña. El cofre se abre con un chasquido metálico.");
        await pausa(500);
        await imprimir("Dentro hallas fasciculo de un libro antiguo...");
        await pausa(500);
        await imprimir("- Ese es un fragmento del Necronomicon - dice Armitage - El volumen completo se encuentra en la biblioteca de la Universidad Miskatonic, pero es un libro peligroso. Ten cuidado.");
        jugador.inventario.push("Fasciculo del Necronomicon");
        const indiceLlave = jugador.inventario.indexOf("Llave");
        if (indiceLlave !== -1) {
            jugador.inventario.splice(indiceLlave, 1);
        }
        estadoEstudio.cofreAbierto = true;
        actualizarPanelInfo(jugador.clase);
    } else {
        await imprimir("El cofre está firmemente cerrado. Necesitas una llave para abrirlo.");
    }
    mostraropcion("VOLVER", estudio);
}

async function escenaLibreria() {
    limpiarPantalla();
    estadoEstudio.peligro++;
    if (!estadoEstudio.libreriaInvestigada) {
        await imprimir("Te acercas a la librería. Notas que varios tomos en los estantes superiores están tambaleándose peligrosamente.");
        await pausa(500);
        mostraropcion("INTENTAR COGER UN LIBRO", async () => {
            limpiarPantalla();
            await imprimir("Al estirar el brazo, toda la fila de libros se desploma sobre ti.");
            const prueba = tirarDadoMedio("agilidad");
            
            await pausa(500);
            if (!prueba.exito) {
                await imprimir("Un pesado diccionario te golpea la cabeza. Eso va a dejarte una marca...");
                await recibirDaño(1, 0);
            } else {
                await imprimir("Logras esquivar la mayoría de los libros con un movimiento rápido sin perder la compostura.");
            }
            
            await pausa(500);
            await imprimir("Los libros ahora están desparramados sobre el suelo. Inevitablemente te fijas en ellos y tu mirada intenta encontrar alguna pista de utilidad. En los libros no hay nada pero notas que en los bordes de la alfombra sobre la que han caido hay marcas de tierra fresca, como si algo hubiera estado cavando debajo.");
            estadoEstudio.pistaAlfombra = true;
            estadoEstudio.libreriaInvestigada = true;
            await pausa(500);
            mostraropcion("VOLVER", estudio);
        });

        mostraropcion("IRSE A OTRO LADO", estudio);

    } else {        
        await imprimir("Vuelves a acercarte a la librería. Los libros estan por el suelo. No encuentras nada nuevo.");
        await pausa(500);
        mostraropcion("IRSE A OTRO LADO", estudio);
    }
}

async function escenaEscritorio() {
    limpiarPantalla();
    estadoEstudio.peligro++;
    if (!estadoEstudio.escritorioInvestigado) {
        await imprimir("El escritorio está lleno de papeles amarillentos y carpetas del FBI.");
        estadoEstudio.escritorioInvestigado = true;
    } else {
        await imprimir("Revisas de nuevo el escritorio. Pero los papeles siguen igual de amarillentos y las carpetas del FBI no han cambiado nada.");
    }
    await pausa(500);
    if (!estadoEstudio.leerInformes) {
        mostraropcion("LEER INFORMES POLICIALES", async () => {
            limpiarPantalla();
            await imprimir("Te sumerges en las descripciones gráficas de los asesinatos...");
            let prueba;
            if (jugador.inventario.includes("Relicario de plata")) {
                prueba = tirarDadoFacil("voluntad");
            } else {
                prueba = tirarDadoMedio("voluntad");
            }
            await pausa(1000);
            if (prueba.exito) {
                await imprimir("Consigues soportar el horror y descubres que un superviviente a los ataques se encuentra delirando en el manicomio de Arkham.");
                estadoEstudio.leerInformes = true;
            } else {
                await imprimir("No puedes mas... Las imágenes son demasiado. Tu mente flaquea ante tal brutalidad.");
                await recibirDaño(0, 1);
            }
            await pausa(500);
            mostraropcion("VOLVER", estudio);
        });
    }

    if (!estadoEstudio.llaveEncontrada) {
        mostraropcion("REVOLVER LOS PAPELES", async () => {
            limpiarPantalla();
            await imprimir("Mueves carpetas y cajones con prisas. Entre unos recibos viejos, aparece una llave pequeña.");
            jugador.inventario.push("Llave");
            estadoEstudio.llaveEncontrada = true;
            actualizarPanelInfo(jugador.clase);
            await pausa(500);
            mostraropcion("VOLVER", estudio);
        });
    }

    mostraropcion("VOLVER", estudio);
}

async function placajePared() {
    limpiarPantalla();
    await imprimir("Gritas de frustración y embistes la pared sólida con todo tu peso.");
    await pausa(500);
    await imprimir("EL impacto es seco y doloroso. La pared ni siquiera vibra. Eres un idiota.");
    await recibirDaño(1, 0);
    estadoEstudio.peligro++;
    mostraropcion("SOREPRENDENTEMENTE, SEGUIR AQUÍ", estudio);
}

async function apartarAlfombra() {
    limpiarPantalla();
    
    estadoEstudio.peligro++;
    await imprimir("Empiezas a mover el pesado escritorio y los muebles que cubren la alfombra. El esfuerzo es considerable.");
    await pausa(500);

    const prueba = tirarDadoFacil("fuerza");

    if (prueba.exito) {
        await imprimir("Con un último esfuerzo, logras despejar la zona. La pesada madera cede y dejas al descubierto una trampilla de madera vieja.");
    } else {
        await imprimir("Un mal gesto al mover el escritorio te provoca un pinchazo agudo en la espalda, pero logras apartarlo. Bajo la alfombra, aparece una trampilla.");
        await recibirDaño(1, 0);
    }

    await pausa(500);
    estadoEstudio.alfombraApartada = true;
    mostraropcion("CONTINUAR INVESTIGANDO EL ESTUDIO", estudio);
    mostraropcion("BAJAR POR LA TRAMPILLA", intentarSalir);
}

async function intentarSalir() {
    limpiarPantalla();

    await imprimir("Giras lentamente el picaporte, y la puerta se abre para descubrir que bajo ella se encuentra el pasillo.");
    await pausa(500);
    
    await imprimir("Saltas por el umbral y caéis sobre una tierra blanda. La puerta del estudio se cierra de golpe sobre tu cabeza. Un olor a madera quemada llena el estrecho pasillo, mezclado con el hedor de la putrefacción y la descomposición.");

    await pausa(1000);
    mostraropcion("CONTINUAR", pasillo);
}












//=================================================================================================================================
// --- ACTO 1: EL RESTO DE LA CASA ---
//=================================================================================================================================

let estadoPasillo = {
    visitas: 0,
    peligro: 0,
    PELIGRO_MAXIMO: 6,
    cocinaInvestigada: false,
    barrilEncontrado: false,
    salonInvestigado: false,
    sotanoInvestigado: false,
    hieloEncontrado: false,
    puertaBarreraDescubierta: false,
    vagabundoAparecido: false
};


// ==============================================================
// --- PASILLO ---
// ==============================================================

async function pasillo() {
    limpiarPantalla();
    if (estadoPasillo.peligro >= estadoPasillo.PELIGRO_MAXIMO) {
        await eventoAleatorioPeligro(estadoPasillo, pasillo);
        return;
    }

    estadoPasillo.visitas++;
    if (estadoPasillo.visitas === 1) {
        await imprimir("El pasillo es estrecho y oscuro. El suelo cruje bajo tus pies, y las paredes parecen estar cubiertas de una capa de moho pegajoso.");
        await imprimir("A tu izquierda está la cocina. A tu derecha, el salón. Al fondo, la puerta principal.");
        await imprimir("También ves unas escaleras que bajan hacia el sótano.");
    } else if (estadoPasillo.visitas === 2) {
        await imprimir("El pasillo se siente cada vez más opresivo. El aire es denso y difícil de respirar. Las sombras parecen moverse a tu alrededor.");
    } else {
        await imprimir("Cada vez que vuelves al pasillo, sientes que algo se acerca un poco más. El peligro es inminente.");
    }
    

    if (estadoPasillo.peligro >= 4 && !estadoPasillo.vagabundoAparecido) {
        await pausa(1000);
        await aparicionVagabundo();
        return;
    }

    await pausa(500);
    if (!estadoPasillo.puertaBarreraDescubierta) {
        mostraropcion("OBSERVAR CON DETENIMIENTO", observarPuerta);
    }
    mostraropcion("IR A LA COCINA", escenaCocina);
    mostraropcion("IR AL SALÓN", escenaSalon);
    mostraropcion("BAJAR AL SÓTANO", escenaSotano);
    mostraropcion("SALIR POR LA PUERTA PRINCIPAL", intentarSalirCasa);
    if (estadoPasillo.hieloEncontrado && estadoPasillo.barrilEncontrado && estadoPasillo.puertaBarreraDescubierta) {
        mostraropcion("USAR EL BARRIL DE HIELO PARA DESTRUIR LA PUERTA", async () => {
            limpiarPantalla();
            await imprimir("Te acuerdas de los bloques de hielo que viste en el sótano y del barril que encontraste en la cocina. Con mucho esfuerzo, consigues meter uno de ellos en el barril y lo arrastras hasta la puerta principal.");
            await pausa(500);
            await imprimir("Al impactar, el hielo estalla en mil pedazos y la barrera azul se quiebra como si fuera cristal.");
            await pausa(500);
            await imprimir("La puerta principal salta de sus gozne. ¡ESTÁIS LIBRES!");
            await pausa(2000);
            acto2();
        });
    }
}


// ==============================================================
// --- OBSERVAR PUERTA ---
// ==============================================================

async function observarPuerta() {
    limpiarPantalla();
    estadoPasillo.puertaBarreraDescubierta = true;
    await imprimir("Te acercas a la puerta principal. Una barrera de energía azulada vibra violentamente, bloqueando el paso. No te atrevés a tocarla, pero puedes sentir su poder amenazante.");
    await pausa(500);
    await imprimir("Parece ser la única salida de la casa, pero no puedes atravesarla mientras esté activa.");
    await pausa(500);
    
    let prueba;
    if (jugador.inventario.includes("Lupa")) {
        prueba = tirarDadoFacil("inteligencia");
    } else {
        prueba = tirarDadoMedio("inteligencia");
    }
    if (prueba.exito) {
        await imprimir("Hay algo mas en el pasillo que te llama la atencion, junto a la puerta un pesado abrigo de cuero cuelga de un perchero. Parece que puede ser útil para protegerte de algo...");
        await pausa(500);
        mostraropcion("COGER EL ABRIGO", async () => {
            jugador.inventario.push("Abrigo de cuero");
            actualizarPanelInfo(jugador.clase);
            await pausa(500);
            await imprimir("Armitage te mira mal y te dice: 'Al menos podrias haber preguntado antes de cogerlo...'.");
            await pausa(1000);
            pasillo();
        });
        mostraropcion("IGNORAR EL ABRIGO", pasillo);
    }
    mostraropcion("VOLVER", pasillo);
}


// ==============================================================
// --- COCINA ---
// ==============================================================

async function escenaCocina() {
    limpiarPantalla();
    estadoPasillo.peligro++;
    await imprimir("La cocina está sumida en una penumbra aceitosa. El olor a carne podrida es insoportable.");
    await pausa(500);
    if (!estadoPasillo.cocinaInvestigada) {
        mostraropcion("REGISTRAR LAS ALACENAS", async () => {
            limpiarPantalla();
            await imprimir("Buscas entre restos de comida y utensilios oxidados.");
            const prueba = tirarDadoMedio("inteligencia");
            if (prueba.exito) {
                await imprimir("Encuentras un albarán de entrega de los MUELLES DE ARKHAM. Alguien ha estado enviando cajas pesadas con símbolos extraños a un almacén del puerto.");
                jugador.pistasActo2.muelles = true;
                estadoPasillo.cocinaInvestigada = true;
            } else {
                await imprimir("Un enjambre de insectos negros brota de una lata y te muerde las manos.");
                await recibirDaño(1, 1);
            }
            await pausa(500);
            mostraropcion("VOLVER AL PASILLO", pasillo);
            mostraropcion("SEGUIR EXPLORANDO", escenaCocina);
        });
    }

    if (!estadoPasillo.barrilEncontrado) {
        mostraropcion("OBSERVAR ALREDEDOR", async () => {
            limpiarPantalla();
            await imprimir("Encuentras un barril de roble reforzado. Es pesado, pero servirá para transportar algo grande.");
            estadoPasillo.barrilEncontrado = true;
            await pausa(1000);
            mostraropcion("VOLVER AL PASILLO", pasillo);
            mostraropcion("SEGUIR EXPLORANDO", escenaCocina);
        });
    }

    mostraropcion("VOLVER AL PASILLO", pasillo);
}


// ==============================================================
// --- SALON ---
// ==============================================================

async function escenaSalon() {
    limpiarPantalla();
    estadoPasillo.peligro++;
    await imprimir("El salón es una parodia de comodidad. Las sombras de los muebles se alargan hasta el techo.");
    await pausa(500);
    if (!estadoPasillo.salonInvestigado) {
        mostraropcion("EXAMINAR LA MESA CAMILLA", async () => {
            limpiarPantalla();
            await imprimir("Hay un diario abierto sobre la mesa. La última entrada menciona al ANTICUARIO Curwen:");
            await imprimir("'Curwen tiene el polvo plateado... es la única forma de ver a los que caminan entre mundos'.");
            jugador.pistasActo2.anticuario = true;
            estadoPasillo.salonInvestigado = true;
            await pausa(500);
            mostraropcion("VOLVER AL PASILLO", pasillo);
        });
    } else {
        await imprimir("El silencio en el salón es tan pesado que te duelen los oídos.");
        await pausa(500);
    }
    mostraropcion("VOLVER AL PASILLO", pasillo);
}


// ==============================================================
// --- SOTANO ---
// ==============================================================

async function escenaSotano() {
    limpiarPantalla();
    estadoPasillo.peligro++;
    await imprimir("El sótano es una cámara de frío antinatural. El suelo está cubierto de una escarcha grisácea.");
    await pausa(500);
    await imprimir("Ves grandes bloques de hielo usados para conservar alimentos... o algo más.");
    await pausa(500);
    estadoPasillo.hieloEncontrado = true;
    if (estadoPasillo.barrilEncontrado) {
        await imprimir("El barril de la cocina podria servir para transportar uno de esos bloques de hielo.");
    }

    mostraropcion("VOLVER AL PASILLO", pasillo);
}


// ==============================================================
// --- VAGABUNDO DIMENSIONAL ---
// ==============================================================

async function aparicionVagabundo() {
    estadoPasillo.vagabundoAparecido = true;
    limpiarPantalla();
    await imprimir("¡EL AIRE SE DESGARRA DELANTE DE TI!", 80);
    await pausa(500);
    await imprimir("De una grieta que se acaba de formar en el aire surge una criatura aterradora. Con aspecto humanoide pero con un cuerpo retorcido y grandes garras se abalanza contra ti. ¡TIENES QUE REACCIONAR YA O TE ALCANZARÁ!", 40);
    await pausa(500);

    let accionTomada = false;

    const temporizadorAtaque = setTimeout(async () => {
        if (!accionTomada) {
            accionTomada = true;
            limpiarPantalla();
            await imprimir("¡Te has quedado paralizado por el terror! El ser te golpea con una fuerza brutal antes de que puedas moverte.");
            await recibirDaño(2, 2);
            await pausa(1500);
            pasillo();
        }
    }, 1500);

    if (jugador.inventario.includes("Pistola")) {
        mostraropcion("DISPARAR PISTOLA", async () => {
            if (accionTomada) return;
            accionTomada = true;
            clearTimeout(temporizadorAtaque);
            const idx = jugador.inventario.indexOf("Pistola");
            jugador.inventario.splice(idx, 1);
            renderizarInventario();
            limpiarPantalla();
            await imprimir("El estruendo de la pistola resuena. La bala aturde al ser y retrocede a su dimensión.");
            estadoPasillo.peligro = 0;
            await pausa(1500);
            pasillo();
        });
    }

    mostraropcion("ESQUIVAR", async () => {
        if (accionTomada) return;
        accionTomada = true;
        clearTimeout(temporizadorAtaque);
        limpiarPantalla();
        await imprimir("Te lanzas a un lado...");
        const prueba = tirarDadoMedio("agilidad");
        await pausa(800);
        if (prueba.exito) {
            await imprimir("...las garras del ser solo cortan el aire. Se desvanece tras chocar con la pared.");
            estadoPasillo.peligro = 0;
        } else {
            await imprimir("...tropiezas y el ser te alcanza.");
            await recibirDaño(2, 2);
        }
        await pausa(1500);
        pasillo();
    });
}

async function intentarSalirCasa() {
    limpiarPantalla();
    await imprimir("Llegas a la puerta principal. Una barrera de energía azulada vibra violentamente.");
    await pausa(500);
    await imprimir("Intentas atravesar la barrera con fuerza bruta...");
    await pausa(1000);
    await imprimir("¡BOOM! La barrera emite una descarga eléctrica que te lanza volando hacia el centro del pasillo.");
    await recibirDaño(1, 1);
    estadoPasillo.peligro += 2;
    await pausa(1500);
    estadoPasillo.puertaBarreraDescubierta = true;
    pasillo();
}






























































//=================================================================================================================================
// --- ACTO 2: ARKHAM ---
//=================================================================================================================================

let horaActual = 19;
let lugarRitualDescubierto = false;
let vagabundoActo2 = false;
let estadoArkham = {
    restauranteObservado: false,
    roboPillado: false,
    pistaCeniza: false
};

async function avanzarReloj(horas) {
    horaActual += horas;
    if (horaActual >= 24) {
        finalYogSothoth();
    }
}

async function acto2() {
    limpiarPantalla();
    await imprimir("ACTO 2: SOMBRAS SOBRE ARKHAM", 70);
    await pausa(1000);
    await imprimir("Por fin estáis fuera. El aire de Arkham es frío y huele a lluvia y humo pero despues de lo que has vivido te sabe a gloria.");
    await pausa(1000);
    await relatoArmitage();
}

/**
 * ESCENA: EL ÚLTIMO RELATO DE ARMITAGE
 */
async function relatoArmitage() {
    limpiarPantalla();
    await imprimir("Os alejáis unos metros de la casa, que ahora yace en un silencio antinatural.");
    await imprimir("Armitage se apoya en un muro, jadeando. Su rostro está pálido bajo la luz de la luna.");
    await pausa(1000);
    await imprimir("- Escucha... - dice con voz temblorosa - Lo que hemos visto en esa casa no es un incidente aislado. Tengo la sensacion de que estamos enfrentando algo mucho más grande que nosotros.");
    await pausa(800);
    await imprimir("- Hace dias me llegaron noticias de una posible secta operando en Arkham...");
    await pausa(800);
    await imprimir("- Esos seres... los Vagabundos Dimensionales... no son de nuestro mundo. Son sabuesos que la secta invoca para limpiar el camino a algo mucho peor.");
    await pausa(800);
    await imprimir("- Están preparando un ritual para invocar a Yog-Sothoth. Si consiguen abrir la Puerta por completo, el tiempo y el espacio dejarán de tener sentido...");
    await pausa(1200);

    // --- EL ATAQUE ---
    limpiarPantalla();
    await imprimir("¡CUIDADO!", 100);
    await pausa(200);
    await imprimir("El aire detrás de Armitage se retuerce violentamente, como si una mano invisible estuviera arrugando el tejido de la realidad.");
    await pausa(500);
    await imprimir("Un par de garras largas y translúcidas surgen del vacío y atraviesan el pecho del profesor.");
    await pausa(300);
    await imprimir("Armitage suelta un grito ahogado. Sangre oscura mancha su abrigo mientras el Vagabundo Dimensional tira de él hacia la grieta.");
    await pausa(1000);
    await imprimir("Con un chasquido sordo, la criatura desaparece de vuelta a su dimensión, dejando caer el cuerpo inerte de Armitage al suelo.");
    await pausa(1500);

    await imprimir("Corres hacia él, pero es demasiado tarde. Sus ojos pierden el brillo mientras intenta decir algo.");
    await imprimir("- Detén... el ritual... - Su mano cae sin vida.");
    await pausa(2000);
    
    await imprimir("Estás solo. Arkham parece ahora un lugar mucho más grande y peligroso sin el profesor.");
    await pausa(2000);
    mapaArkham();
}

async function mapaArkham() {
    limpiarPantalla();
    
    if (lugarRitualDescubierto && horaActual >= 23) {
        mostraropcion("IR A SENTINEL HILL (FINAL)", finalRitualPronto);
    }

    if (horaActual >= 21 && !vagabundoActo2){
        vagabundoActo2 = true;
        await aparicionVagabundoArkham();
    }

    await imprimir("--- MAPA DE ARKHAM ---");
    await imprimir(`Hora actual: ${horaActual}:00 (Límite: 24:00)`);
    await pausa(500);

    //lugares fijos
    mostraropcion("RESTAURANTE DE VELMA", escenaVelma);
    mostraropcion("CUARTEL DE POLICÍA", escenaPolicia);
    mostraropcion("HOSPITAL DE SANTA MARÍA", escenaHospital);

    //lugares desbloqueables
    if (jugador.pistasActo2.universidad) mostraropcion("UNIVERSIDAD MISKATONIC", escenaMiskatonic);
    if (jugador.pistasActo2.manicomio) mostraropcion("MANICOMIO DE ARKHAM", escenaManicomio);
    if (jugador.pistasActo2.muelles) mostraropcion("MUELLES DE ARKHAM", escenaMuelles);
    if (jugador.pistasActo2.anticuario) mostraropcion("TIENDA DE ANTIGÜEDADES CURWEN", escenaAnticuario);
}












// ==============================================================
// --- VAGABUNDO DIMENSIONAL ---
// ==============================================================

async function aparicionVagabundoArkham() {
    limpiarPantalla();
    await imprimir("LAS LUCES DE LAS FAROLAS PARPADEAN Y SE APAGAN...", 60);
    await pausa(1000);
    await imprimir("Un frío glacial recorre la calle vacía. De entre las sombras de un callejón, el aire se desgarra con un sonido de cristal roto.");
    await imprimir("Un Vagabundo Dimensional mucho más grande que el de la casa surge frente a ti, bloqueando tu camino con sus garras translúcidas. ¡NO TIENES DÓNDE ESCONDERTE!", 40);
    await pausa(800);

    let accionTomada = false;

    // Temporizador de reacción (1.2 segundos, algo más difícil que en la casa)
    const temporizadorAtaque = setTimeout(async () => {
        if (!accionTomada) {
            accionTomada = true;
            limpiarPantalla();
            await imprimir("¡El horror te paraliza! La criatura te atraviesa el hombro con una garra gélida antes de desvanecerse en la niebla.");
            await recibirDaño(3, 2); // Daño considerable por ser el Acto 2
            await pausa(2000);
            mapaArkham();
        }
    }, 800);

    // Opción de combate si tiene el arma
    if (jugador.inventario.includes("Pistola")) {
        mostraropcion("DISPARAR A BOCAJARRO", async () => {
            if (accionTomada) return;
            accionTomada = true;
            clearTimeout(temporizadorAtaque);
            const idx = jugador.inventario.indexOf("Pistola");
            jugador.inventario.splice(idx, 1);
            renderizarInventario();
            limpiarPantalla();
            await imprimir("El disparo ilumina la calle. La bala impacta en el centro de la grieta dimensional, obligando a la criatura a retroceder entre chillidos.");
            await pausa(2000);
            mapaArkham();
        });
    }

    mostraropcion("BUSCAR COBIJO TRAS UN COCHE", async () => {
        if (accionTomada) return;
        accionTomada = true;
        clearTimeout(temporizadorAtaque);
        limpiarPantalla();
        await imprimir("Te lanzas tras un Ford Model T aparcado...");
        const prueba = tirarDadoMedio("agilidad");
        await pausa(1000);
        if (prueba.exito) {
            await imprimir("...el ser golpea el metal del coche, creando una abolladura imposible, pero logras rodearlo y escapar por un callejón.");
        } else {
            await imprimir("...tropiezas con el bordillo y el ser te alcanza en la pierna.");
            await recibirDaño(2, 1);
        }
        await pausa(2000);
        mapaArkham();
    });
}












// ==============================================================
// --- RESTAURANTE ---
// ==============================================================

visitasVelma = 0;
async function escenaVelma() {
    limpiarPantalla();
    visitasVelma++;
    let pedirWiskey = false;
    if (estadoArkham.roboPillado) {
        await imprimir("Al entrar, Velma te mira con odio. Joe, el encargado, te señala con el dedo y grita: '¡Ese es el ladrón que intentó robar la bolsa de dinero! ¡Fuera de aquí!'");
        await pausa(1500);
        mapaArkham();
        return;
    }
    if (visitasVelma === 1) {
        await avanzarReloj(1);
        await imprimir("El restaurante de Velma es ruidoso y huele a café quemado. Joe, el encargado, limpia la barra con aire ausente.");
    }
    await pausa(500);
    mostraropcion("HABLAR CON JOE", dialogoJoeInicio);

    if (!pedirWiskey) {
        mostraropcion("PEDIR WISKEY", async () => {
            pedirWiskey = true;
            limpiarPantalla();
            await imprimir("Pides un trago de wiskey. Joe te sirve un vaso con un líquido oscuro y fuerte.");
            await pausa(500);
            await imprimir("Al beberlo, sientes un calor intenso que se extiende por tu cuerpo. El wiskey es fuerte, pero te ayuda a calmar los nervios, pero te deja un leve mareo.");
            await pausa(500);
            jugador.clase.salud_mental = Math.min(jugador.clase.salud_mental + 1, 9);
            actualizarPanelInfo(jugador.clase);
            escenaVelma();
        });
    }
    
    if (!estadoArkham.restauranteObservado) {
        mostraropcion("OBSERVAR EL LOCAL", async () => {
            limpiarPantalla();
            let prueba;
            estadoArkham.restauranteObservado = true;
            await imprimir("Te tomas un momento para observar el local con detenimiento...");
            if (jugador.inventario.includes("Lupa")) {
                prueba = tirarDadoFacil("inteligencia");
            } else {            
                prueba = tirarDadoMedio("inteligencia");
            }
            if (prueba.exito) {
                await imprimir("Notas que en una de las mesas hay una bolsa de dinero olvidada.");
                mostraropcion("COGER LA BOLSA", async () => {
                    await imprimir("Intentas coger la bolsa sin llamar la atención...");
                    let pruebaSigilo = tirarDadoMedio("agilidad");
                    if (!pruebaSigilo.exito) {
                        await imprimir("¡Joe te ve intentando robar la bolsa! Se levanta furioso y te echa del local.");
                        await recibirDaño(1, 0);
                        await pausa(1500);
                        estadoArkham.roboPillado = true;
                        mapaArkham();
                        return;
                    } else {
                        await imprimir("Recoges la bolsa de dinero y te la guardas en el bolsillo.");
                        jugador.inventario.push("Bolsa de dinero");
                        actualizarPanelInfo(jugador.clase);
                        await pausa(500);
                        escenaVelma();
                    }
                });
                mostraropcion("DEJARLA", escenaVelma);
            } else {
                await imprimir("El local es un caos de mesas desordenadas y platos sucios. No encuentras nada de interés.");
                escenaVelma();
            }
        });
    }
    mostraropcion("SALIR", mapaArkham);
}

async function dialogoJoeInicio() {
    limpiarPantalla();
    await imprimir("- ¿Qué quieres? - Joe no levanta la vista del trapo -.");
    
    mostraropcion("PREGUNTAR POR ARMITAGE", async () => {
        await imprimir("- ¿El viejo profesor? No lo he visto. Y si lo viera, no te lo diría a ti. Pareces traer problemas.");
        dialogoJoeContinuar();
    });
    
    mostraropcion("PEDIR UN CAFÉ Y CHARLAR", async () => {
        await imprimir("- Joe te sirve una taza de brebaje negro -. Son cinco centavos. La ciudad está rara hoy, ¿verdad? Demasiada niebla.");
        dialogoJoeContinuar();
    });
}

async function dialogoJoeContinuar() {
    await pausa(500);
    await imprimir("- Oye Joe, he oído que ha habido entregas extrañas últimamente...");
    await pausa(500);
    await imprimir("Ves como el encargado titubea y se pone nervioso.");
    
    mostraropcion("PERSUADIR: 'Seguro que has notado algo en los suministros'.", async () => {
        const prueba = tirarDadoMedio("inteligencia");
        if (prueba.exito) {
            await imprimir("- Joe suspira -. Tienes ojo. Hace días llegó un paquete que no pedimos. Venía del MUELLE.");
            await imprimir("- Estaba manchado de sangre roja, muy roja. Joe baja la voz: Nadie vino a por él, pero la caja vibraba.");
            jugador.pistasActo2.muelles = true;
        } else {
            await imprimir("- No sé de qué me hablas. Bebe tu café y vete.");
        }
        await pausa(2000);
        mapaArkham();
    });

    mostraropcion("INTIMIDAR: 'Sé que ocultas algo sobre esos paquetes'.", async () => {
        const prueba = tirarDadoMedio("fuerza");
        if (prueba.exito) {
            await imprimir("- Joe se tensa -. Vale, vale. No busco líos. Hubo una caja del MUELLE. Sangre por todas partes. Velma la tiró, pero el símbolo de la etiqueta era una estrella retorcida.");
            jugador.pistasActo2.muelles = true;
        } else {
            await imprimir("- Joe saca un mazo de debajo de la barra -. ¡Fuera de aquí antes de que te rompa los dientes!");
            recibirDaño(1, 0);
        }
        await pausa(2000);
        mapaArkham();
    });
}













// ==============================================================
// --- POLICIA ---
// ==============================================================

async function escenaPolicia() {
    limpiarPantalla();
    await avanzarReloj(1);
    await imprimir("Entras en la Comisaría y les cuentas lo que sabes. El Sheriff Anderson se ríe en tu cara.");
    await pausa(500);
    await imprimir("- ¿Monstruos invisibles? Escuche, vuelva a casa. Arkham no es lugar para locos.");
    await recibirDaño(0, 1);
    await pausa(1000);
    const prueba = tirarDadoMedio("inteligencia");
    if (prueba.exito) {
        await imprimir("En una mesa junto a la puerta ves una pistola desatendida. Te vendria bien, pero es arriesgado cogerla sin permiso...");
        mostraropcion("COGER LA PISTOLA", async () => {
            const pruebaSigilo = tirarDadoMedio("agilidad");
            if (!pruebaSigilo.exito) {
                await imprimir("¡El Sheriff te ve intentando coger la pistola! Se levanta furioso y te echa de la comisaría.");
                await recibirDaño(1, 0);
                await pausa(1500);
                mapaArkham();
                return;
            } else {
                await imprimir("Con cuidado, coges la pistola y la guardas en tu abrigo antes de salir a la calle.");
                jugador.inventario.push("Pistola");
                actualizarPanelInfo(jugador.clase);
                await pausa(500);
                mapaArkham();
            }
        });
        mostraropcion("NO TOCAR NADA", mapaArkham);
    }
    mostraropcion("SALIR", mapaArkham);
}











// ==============================================================
// --- HOSPITAL ---
// ==============================================================

async function escenaHospital() {
    limpiarPantalla();
    await avanzarReloj(1);
    await imprimir("El Hospital de Santa María es silencioso. Las enfermeras te miran con compasión.");
    mostraropcion("DESCANSAR Y CURARSE", async () => {
        await avanzarReloj(1);
        jugador.clase.salud_fisica = Math.min(jugador.clase.salud_fisica + 2, 9);
        jugador.clase.salud_mental = Math.min(jugador.clase.salud_mental + 1, 9);
        actualizarPanelInfo(jugador.clase);
        await imprimir("Te sientes mucho mejor, pero la noche ha avanzado peligrosamente.");
        await pausa(2000);
        mostraropcion("HABLAR CON LA ENFERMERA", async () => {
            await imprimir("La enfermera te escucha con mucha empatia y te cuenta unos rumores sobre un paciente que llegó hace unos días con heridas extrañas. Dijo algo sobre 'ser perseguido por sombras'.");
            await imprimir("El paciente está en el ala este del manicomio, pero nadie se atreve a acercarse a él. Dicen que grita por las noches y que su habitación está llena de símbolos extraños.");
            jugador.pistasActo2.manicomio = true;
            mostraropcion("SALIR", mapaArkham);
        });
        mostraropcion("SALIR", mapaArkham);
    });
    mostraropcion("HABLAR CON LA ENFERMERA", async () => {
        await imprimir("La enfermera te escucha con mucha empatia y te cuenta unos rumores sobre un paciente que llegó hace unos días con heridas extrañas. Dijo algo sobre 'ser perseguido por sombras'.");
        await imprimir("El paciente está en el ala este del manicomio, pero nadie se atreve a acercarse a él. Dicen que grita por las noches y que su habitación está llena de símbolos extraños.");
        jugador.pistasActo2.manicomio = true;
        mostraropcion("SALIR", mapaArkham);
    });
}











// ==============================================================
// --- ANTICUARIO ---
// ==============================================================

async function escenaAnticuario() {
    limpiarPantalla();
    await avanzarReloj(1);
    await imprimir("Curwen niega con la cabeza cuando preguntas por un polvo magico.");
    await imprimir("- Llegas tarde. Un hombre nervioso vino hace una hora y se llevó el último vial.");
    await imprimir("- Dijo que lo necesitaba para la 'ceremonia final' en SENTINEL HILL. Parecía que le iba la vida en ello.");
    lugarRitualDescubierto = true;
    await pausa(1000);
    if (jugador.inventario.includes("Bolsa de dinero")) {
        mostraropcion("COMPRAR ALGO APARTE", async () => {
            limpiarPantalla();
            await imprimir("Curwen se fija en tu bolsa de dinero y te ofrece algunos objetos interesantes a cambio...");
            await pausa(5000);
            mostraropcion("COMPRAR AMULETO PROTECTOR", async () => {
                jugador.inventario.push("Amuleto");
                const idx = jugador.inventario.indexOf("Bolsa de dinero");
                jugador.inventario.splice(idx, 1);
                actualizarPanelInfo(jugador.clase);
                mostraropcion("SALIR", mapaArkham);
            });
            mostraropcion("COMPRAR RELICARIO DE PLATA", async () => {
                jugador.inventario.push("Relicario de plata");
                const idx = jugador.inventario.indexOf("Bolsa de dinero");
                jugador.inventario.splice(idx, 1);
                actualizarPanelInfo(jugador.clase);
                mostraropcion("SALIR", mapaArkham);
            });
            mostraropcion("SALIR", mapaArkham);
        });
    }
    mostraropcion("IR A OTRO LADO", mapaArkham);
}











// ==============================================================
// --- MUELLES DE ARKHAM ---
// ==============================================================

let alertaMuelles = 0; // Mecánica de alerta acumulativa
let visitasMuelles = 0;
let estadoMuelles = {
    reciboEncontrado: false,
    simboloDescubierto: false,
    eterEncontrado: false
};

async function escenaMuelles() {
    limpiarPantalla();
    visitasMuelles++;
    await avanzarReloj(1); // El tiempo avanza al explorar
    
    if (visitasMuelles === 1) {
        await imprimir("La niebla en los muelles es tan espesa que casi puedes masticarla. El agua del Miskatonic golpea los pilotes con un sonido rítmico y pesado.");
        await imprimir("Frente a ti se encuentra el Almacén 17. Varias cajas con un símbolo de una estrella de cinco puntas están apiladas fuera, custodiadas por un guarda de mirada torva.");
    } else {
        await imprimir("El almacén sigue igual, pero ahora estás más alerta. El guarda te mira con desconfianza cada vez que te acercas.");
    }
    await pausa(500);

    // Ventaja de Personaje: Malasombra conoce los bajos fondos
    if (jugador.clase.nombre === "Malasombre O'Toole") {
        mostraropcion("USAR CONTACTOS CRIMINALES", usarContactosMuelles);
    }

    mostraropcion("FORZAR LA CERRADURA LATERAL", forzarEntradaMuelles);
    mostraropcion("NOQUEAR AL GUARDA DE LA ENTRADA", noquearGuardaMuelles);
    mostraropcion("SALIR DE LOS MUELLES", mapaArkham);
}

// --- RESOLUCIÓN DE ENTRADA ---

async function usarContactosMuelles() {
    limpiarPantalla();
    await imprimir("Haces una señal silbando entre dientes. Uno de los guardias te reconoce y asiente discretamente.");
    await imprimir("- 'Malasombra... entra rápido y no hagas ruido. Si el capataz te ve, estamos muertos los dos'.");
    await pausa(1000);
    interiorAlmacenMuelles();
}

async function forzarEntradaMuelles() {
    limpiarPantalla();
    await imprimir("Sacas tus herramientas e intentas manipular la cerradura de la puerta de servicio...");
    const prueba = tirarDadoMedio("agilidad");
    await pausa(1000);
    
    if (prueba.exito) {
        await imprimir("La cerradura cede con un clic metálico. Te deslizas al interior sin ser visto.");
        await pausa(1000);
        interiorAlmacenMuelles();
    } else {
        alertaMuelles++; // Fallar aumenta la alerta
        await imprimir("¡Maldición! El metal chirría demasiado fuerte y ves una linterna acercándose.");
        await pausa(1500);
        
        if (alertaMuelles >= 2) {
            await ataqueVagabundoMuelles();
        } else {
            escenaMuelles(); // Reintento o cambio de táctica
        }
    }
}

async function noquearGuardaMuelles() {
    limpiarPantalla();
    await imprimir("Te aproximas por la espalda al guarda. Un golpe seco debería ser suficiente...");
    const prueba = tirarDadoMedio("fuerza");
    await pausa(1000);

    if (prueba.exito) {
        await imprimir("El hombre cae como un fardo de patatas. Arrastras el cuerpo tras unas cajas y entras.");
        await pausa(1000);
        interiorAlmacenMuelles();
    } else {
        alertaMuelles += 2; // Un combate fallido alerta mucho más
        await imprimir("El guarda se gira a tiempo y bloquea tu golpe. Suelta un grito antes de que logres reducirlo.");
        await recibirDaño(1, 0); // Daño por el forcejeo
        await imprimir("Te consigues zafar y huyes, pero el ruido ha alertado a los otros trabajadores.");
        await pausa(1500);
        
        if (alertaMuelles >= 2) {
            await ataqueVagabundoMuelles();
        } else {
            escenaMuelles();
        }
    }
}

// --- INTERIOR: INVESTIGACIÓN Y OBJETOS ---

async function interiorAlmacenMuelles() {
    limpiarPantalla();
    await imprimir("El almacén está lleno de cajas con el símbolo de la estrella. Al fondo, ves un pequeño despacho iluminado por una lámpara de aceite.");
    await pausa(500);

    if (!estadoMuelles.reciboEncontrado) {
        mostraropcion("REGISTRAR EL DESPACHO DEL CAPATAZ", descubrirPistasMuelles);
    }
    
    if (!estadoMuelles.simboloDescubierto) {
        mostraropcion("EXAMINAR LOS BOCETOS SOBRE LAS CAJAS", descubrirSimboloMuelles);
    }

    if (!estadoMuelles.eterEncontrado) {
        mostraropcion("COGER FRASCO DE ÉTER DE LOS SUMINISTROS", cogerEterMuelles);
    }

    mostraropcion("SALIR DEL ALMACÉN", mapaArkham);
}

async function descubrirPistasMuelles() {
    limpiarPantalla();
    estadoMuelles.reciboEncontrado = true;
    jugador.pistasActo2.anticuario = true; // Desbloquea la tienda en el mapa
    
    await imprimir("Encuentras un recibo de la 'Tienda de Antigüedades Curwen'. Indica la compra de 'Polvo Plateado' para un ritual inminente.");
    await pausa(2000);
    interiorAlmacenMuelles();
}

async function descubrirSimboloMuelles() {
    limpiarPantalla();
    estadoMuelles.simboloDescubierto = true;
    await imprimir("Encuentras unos planos del ritual. Hay tres runas dibujadas, pero solo una tiene una nota al margen: 'LA ESTRELLA - La clave para invertir el flujo'.");
    await imprimir("Pero aun no sabes donde se va a realizar");
    await pausa(2000);
    interiorAlmacenMuelles();
}

async function cogerEterMuelles() {
    limpiarPantalla();
    estadoMuelles.eterEncontrado = true;
    
    await imprimir("En un estante de químicos, encuentras un frasco de vidrio oscuro sellado con cera.");
    await imprimir("Es éter puro. Un pañuelo empapado con esto podría dormir a un guarda o a cualquier estorbo sin hacer ruido.");
    await pausa(2000);

    mostraropcion("COGER EL FRASCO", async () => {
        jugador.inventario.push("Frasco de Éter");
        actualizarPanelInfo(jugador.clase);
        interiorAlmacenMuelles();
    });
    mostraropcion("DEJARLO", interiorAlmacenMuelles);
}

// --- EVENTO DE FALLO: ATAQUE ---

async function ataqueVagabundoMuelles() {
    alertaMuelles = 0; // Reseteamos la alerta tras el ataque
    limpiarPantalla();
    await imprimir("¡HAS SIDO DESCUBIERTO!", 80);
    await imprimir("El aire sobre ti se rasga y un Vagabundo Dimensional reforzado cae desde las vigas del techo.");
    await recibirDaño(2, 2); // Recibes daño por la emboscada
    await pausa(1000);
    await imprimir("Huyes a ciegas por el muelle y te lanzas al agua helada para escapar de sus garras.");
    await pausa(2000);
    mapaArkham();
}











// ==============================================================
// --- UNIVERSIDAD MISKATONIC ---
// ==============================================================

// Variables de control para esta ubicación
let estadoMiskatonic = {
    lupaEncontrada: false,
    necronomiconEncontrado: false
};

async function escenaMiskatonic() {
    limpiarPantalla();
    await avanzarReloj(1);
    await imprimir("El campus de la Universidad Miskatonic está sumido en el silencio. Te diriges a la imponente Biblioteca Orne.");
    await pausa(500);

    // Detalle de Rol: Daisy Walker trabaja aquí
    if (jugador.clase.nombre === "Daisy Walker") {
        await imprimir("Como bibliotecaria respetada de esta institución, tienes tus propias llaves. Abres la pesada puerta de roble sin ningún problema y te adentras en la oscuridad que tan bien conoces.");
        await pausa(1000);
        interiorBiblioteca();
    } else {
        await imprimir("La puerta principal está cerrada con llave. A través de los cristales ves a un viejo guardia de seguridad haciendo la ronda con una linterna.");
        await pausa(500);
        
        mostraropcion("PASAR CON SIGILO POR UNA VENTANA", infiltracionBiblioteca);
        mostraropcion("CONVENCER AL GUARDIA", convencerGuardia);
        if (jugador.inventario.includes("Frasco de Éter")) {
            mostraropcion("DROGAR AL GUARDIA CON ÉTER", async () => {
                limpiarPantalla();
                await imprimir("Esperas a que el guardia se acerque a la ventana, luego abres el frasco de éter y lo esparces cerca de su camino.");
                await pausa(1000);
                await imprimir("El guardia tose y se tambalea, cayendo al suelo sin conocimiento.");
                await pausa(1000);

                // Elimina el éter del inventario
                const idx = jugador.inventario.indexOf("Frasco de Éter");
                jugador.inventario.splice(idx, 1);
                actualizarPanelInfo(jugador.clase);
                interiorBiblioteca();
            });
        }
        mostraropcion("SALIR AL MAPA", mapaArkham);
    }
}

// --- OBSTÁCULOS DE ENTRADA ---

async function infiltracionBiblioteca() {
    limpiarPantalla();
    await imprimir("Encuentras una ventana semiabierta en el callejón e intentas colarte sin hacer ruido...");
    const prueba = tirarDadoMedio("agilidad");
    await pausa(1000);
    
    if (prueba.exito) {
        await imprimir("Aterrizas suavemente sobre una alfombra en el interior, justo cuando la luz de la linterna del guardia pasa de largo. Estás dentro.");
        await pausa(1000);
        interiorBiblioteca();
    } else {
        await imprimir("¡CRASH! Al pasar, tiras un pesado jarrón decorativo que se hace añicos.");
        await imprimir("El guardia grita alarmado. Presa del pánico, saltas de vuelta al callejón cayendo de bruces y rasgándote la ropa.");
        await recibirDaño(1, 0); // Daño físico por la caída
        await pausa(1000);
        await imprimir("Has llamado demasiado la atención. Tendrás que volver más tarde.");
        await pausa(2000);
        mapaArkham();
    }
}

async function convencerGuardia() {
    limpiarPantalla();
    await imprimir("Golpeas el cristal para llamar su atención. Te inventas una excusa sobre unos documentos de vital importancia que el director necesita de inmediato.");
    const prueba = tirarDadoDificil("inteligencia"); // Es difícil engañar a alguien a estas horas
    await pausa(1000);
    
    if (prueba.exito) {
        await imprimir("El anciano parpadea, confuso, pero tu aplomo le convence. Murmura algo sobre 'los raros horarios de los académicos' y te abre la puerta.");
        await pausa(1000);
        interiorBiblioteca();
    } else {
        await imprimir("El guardia te enfoca con la linterna a los ojos. 'A otro perro con ese hueso. ¡Lárguese o llamo al Sheriff Anderson!'");
        await pausa(2000);
        mapaArkham();
    }
}

// --- DENTRO DE LA BIBLIOTECA ---

async function interiorBiblioteca() {
    limpiarPantalla();
    await imprimir("El olor a papel viejo, polvo y madera barnizada te envuelve. Las estanterías parecen laberintos diseñados para perderse.");
    await pausa(500);

    if (!estadoMiskatonic.lupaEncontrada) {
        mostraropcion("REVISAR EL MOSTRADOR DE RECEPCIÓN", revisarMostrador);
    }
    
    if (!estadoMiskatonic.necronomiconEncontrado) {
        mostraropcion("BAJAR A LA SECCIÓN RESTRINGIDA", explorarRestringida);
    }

    mostraropcion("SALIR DE LA BIBLIOTECA", mapaArkham);
}

async function revisarMostrador() {
    limpiarPantalla();
    estadoMiskatonic.lupaEncontrada = true;
    await imprimir("Detrás del mostrador principal, rebuscas en los cajones de los bibliotecarios.");
    await pausa(500);
    await imprimir("Encuentras una vieja pero impecable Lupa con mango de marfil. Puede venirte muy bien para observar detalles que a simple vista pasarían desapercibidos.");
    
    jugador.inventario.push("Lupa");
    actualizarPanelInfo(jugador.clase);
    
    await pausa(1500);
    interiorBiblioteca();
}

async function explorarRestringida() {
    limpiarPantalla();
    estadoMiskatonic.necronomiconEncontrado = true;
    
    await imprimir("Bajas por una escalera de caracol hasta la Sección Restringida. El aire aquí es más denso y frío.");
    await pausa(800);
    await imprimir("Al fondo de la sala, sobre un atril de hierro, descansa un libro inmenso encuadernado en una piel pálida y repulsiva.");
    await imprimir("Es el legendario Necronomicón, escrito por el árabe loco Abdul Alhazred.");
    await pausa(1500);
    
    // Prueba de Cordura al interactuar con el libro
    await imprimir("Al poner tus manos sobre él, unas voces susurrantes llenan tu mente de golpe...");
    let prueba;
    if (jugador.inventario.includes("Relicario de plata")) {
        prueba = tirarDadoFacil("voluntad");
    } else {
        prueba = tirarDadoMedio("voluntad");
    }
    await pausa(1000);
    
    if (prueba.exito) {
        await imprimir("Aprietas los dientes y bloqueas las voces. Abres el libro y hojeas sus páginas hasta encontrar exactamente lo que buscabas: el temido 'Cántico de Cierre'.");
    } else {
        await imprimir("El conocimiento prohibido que emana de sus páginas es demasiado para una mente humana. Sientes vértigo y náuseas.");
        await recibirDaño(0, 1);
        await imprimir("Aún así, logras sobreponerte lo suficiente para encontrar el pasaje del 'Cántico de Cierre'.");
    }
    
    await pausa(1000);
    
    // Gestión del Inventario
    jugador.inventario.push("Necronomicón");
    
    // Si el jugador tenía el fascículo del Acto 1, lo borramos porque ahora tiene el libro completo
    if (jugador.inventario.includes("Fasciculo del Necronomicon")) {
        jugador.inventario = jugador.inventario.filter(item => item !== "Fasciculo del Necronomicon");
    }
    
    actualizarPanelInfo(jugador.clase);
    
    await pausa(2500);
    interiorBiblioteca();
}













// ==============================================================
// --- MANICOMIO DE ARKHAM ---
// ==============================================================

async function escenaManicomio() {
    limpiarPantalla();
    await avanzarReloj(1);
    await imprimir("El imponente y sombrío edificio del Manicomio de Arkham se alza frente a ti bajo la niebla.");
    await pausa(500);
    await imprimir("Entras a la recepción. Un enfermero de aspecto severo vigila la gruesa puerta de acero que da acceso a la zona de pacientes peligrosos.");
    await imprimir("Sabes que el superviviente de los bosques del que hablaban los informes policiales está ahí dentro, pero no dejan pasar a visitas a estas horas.");
    await pausa(1000);
    
    mostraropcion("INTENTAR PASAR CON SIGILO", infiltracionManicomio);
    
    // Detalle de rol: Roland Banks es agente del FBI, no necesita mentir.
    if (jugador.clase.nombre === "Roland Banks") {
        mostraropcion("MOSTRAR PLACA DEL FBI", hablarEnfermeroRoland);
    } else {
        mostraropcion("MENTIR: 'SOY DETECTIVE'", hablarEnfermeroMentira);
    }

    if (jugador.inventario.includes("Frasco de Éter")) {
        mostraropcion("DROGAR AL ENFERMERO CON ÉTER", async () => {
            limpiarPantalla();
            await imprimir("Esperas a que el enfermero se acerque a la puerta, luego abres el frasco de éter y lo esparces cerca de su camino.");
            await pausa(1000);
            await imprimir("El enfermero tose y se tambalea, cayendo al suelo sin conocimiento.");
            await pausa(1000);

            // Elimina el éter del inventario
            const idx = jugador.inventario.indexOf("Frasco de Éter");
            jugador.inventario.splice(idx, 1);
            actualizarPanelInfo(jugador.clase);
            pasillosManicomio();
        });
    }
    
    mostraropcion("SALIR DE ALLÍ", mapaArkham);
}

// --- RESOLUCIÓN DEL OBSTÁCULO ---

async function infiltracionManicomio() {
    limpiarPantalla();
    await imprimir("Esperas escondido a que el enfermero se gire a rellenar unos historiales médicos e intentas escabullirte...");
    const prueba = tirarDadoMedio("agilidad");
    await pausa(1000);
    
    if (prueba.exito) {
        await imprimir("Eres rápido como una sombra. Logras deslizarte por la puerta metálica antes de que se cierre del todo sin hacer un solo ruido.");
        await pausa(1000);
        pasillosManicomio();
    } else {
        await imprimir("Calculas mal el tiempo y la pesada puerta rechína delatándote.");
        await imprimir("El enfermero te agarra violentamente del cuello del abrigo. '¡Eh, tú! ¡Aquí no se puede entrar!'");
        await recibirDaño(1, 0); // Te llevas un buen empujón
        await imprimir("Te echan a la calle de malas maneras.");
        await pausa(2000);
        mapaArkham();
    }
}

async function hablarEnfermeroRoland() {
    limpiarPantalla();
    await imprimir("Sacas tu placa del FBI y la golpeas contra el mostrador con autoridad. 'Aparta, hijo. Asuntos federales'.");
    await pausa(1000);
    await imprimir("El enfermero traga saliva, asiente nerviosamente y desbloquea la puerta sin hacer preguntas.");
    await pausa(1000);
    pasillosManicomio();
}

async function hablarEnfermeroMentira() {
    limpiarPantalla();
    await imprimir("Adoptas una postura firme y le aseguras que vienes de parte del Sheriff Anderson para un interrogatorio de máxima urgencia.");
    const prueba = tirarDadoMedio("inteligencia");
    await pausa(1000);
    
    if (prueba.exito) {
        await imprimir("El enfermero duda un segundo rascándose la cabeza, pero tu labia es convincente. Finalmente asiente y te abre la puerta.");
        await pausa(1000);
        pasillosManicomio();
    } else {
        await imprimir("El enfermero te mira de arriba a abajo con desprecio. 'Anderson me habría avisado por teléfono. Lárguese antes de que llame a la policía de verdad'.");
        await imprimir("No te queda más remedio que dar media vuelta.");
        await pausa(2000);
        mapaArkham();
    }
}

// --- DENTRO DE LA ZONA RESTRINGIDA ---

async function pasillosManicomio() {
    limpiarPantalla();
    await imprimir("Avanzas por el ala este. El ambiente aquí es helado y los lamentos ahogados resuenan tras las puertas acolchadas.");
    await pausa(800);
    await imprimir("Llegas a la celda del superviviente. Está acurrucado en una esquina, temblando compulsivamente.");
    await pausa(1000);
    
    // PISTA PARA EL ACTO 3: LA CENIZA
    await imprimir("Notas algo peculiar: hay una gruesa línea de ceniza gris esparcida por todo el umbral de su puerta.");
    await imprimir("Uno de los pacientes murmura sin cesar, meciéndose: 'La ceniza... la ceniza de los fuegos puros... ellos no pueden cruzarla... sus garras no la tocan...'");
    await pausa(1500);
    await imprimir("Quizás la ceniza garantiza la seguridad, pero son los desvarios de un loco.", 20);
    await pausa(1000);
    estadoArkham.pistaCeniza = true;

    mostraropcion("INTERROGAR AL PACIENTE", interrogatorioPaciente);
    mostraropcion("VOLVER A LA CALLE", mapaArkham);
}

// --- EL INTERROGATORIO (LA PRUEBA) ---

async function interrogatorioPaciente() {
    limpiarPantalla();
    await imprimir("Te acercas a los barrotes. Le exiges que te cuente qué están tramando esos seres y la secta de Arkham.");
    await pausa(800);
    await imprimir("El paciente deja de mecerse. Levanta la cabeza lentamente. Sus ojos están vacíos, inyectados en sangre.");
    await pausa(500);
    await imprimir("De repente, se abalanza contra los barrotes y empieza a gritar. Sus alaridos no son solo sonido, proyectan visiones de horrores cósmicos directamente en tu mente.");
    
    let prueba;
    if (jugador.inventario.includes("Relicario de plata")) {
        await imprimir("El relicario de plata vibra con una energía protectora, ayudándote a mantener la concentración.");
        prueba = tirarDadoFacil("voluntad");
    } else {
        prueba = tirarDadoMedio("voluntad");
    }
    await pausa(1500);
    
    if (prueba.exito) {
        await imprimir("Soportas el torrente de imágenes grotescas. Te agarras a los barrotes y le obligas a terminar la frase.");
        await imprimir("El loco aúlla con claridad: ¡A LAS DOCE! ¡EL UMBRAL SE ABRE CUANDO LAS SOMBRAS NO TENGAN DUEÑO!");
        await pausa(1000);
        await imprimir("¡A LAS DOCE OCURRIRA EL HORROR Y VENDRÁ A POR MI!", 50);
        await pausa(2500);
        mapaArkham();
    } else {
        await imprimir("Las visiones de ángulos imposibles y oscuridad infinita te sobrepasan. Sientes que tu cerebro va a estallar.");
        await recibirDaño(0, 2);
        await imprimir("Te tapas los oídos aterrorizado y huyes corriendo por el pasillo hacia la calle sin mirar atrás.");
        await pausa(2500);
        mapaArkham();
    }
}






























































// ====================================================================================================================================
// --- ACTO 3: EL RITUAL EN SENTINEL HILL ---
// ====================================================================================================================================

async function finalRitualPronto() {
    limpiarPantalla();
    await imprimir("ACTO 3: EL RITUAL", 70);
    await pausa(1000);
    await imprimir("Subes la ladera de Sentinel Hill. El aire vibra con una frecuencia que hace que tus dientes castañeen.");
    await imprimir("Ves el círculo de menhires. Los cultistas entonan un cántico que desgarra el espacio.");
    await pausa(1000);
    escenaAscenso();
}







async function escenaAscenso() {
    limpiarPantalla();
    await imprimir("La ladera es un laberinto de rocas afiladas y niebla púrpura. El cántico de los cultistas arriba suena como un trueno constante.");
    await imprimir("Ves tres senderos...");
    await imprimir("El sendero de la izquierda tiene la hierba aplastada, como si alguien o algo hubiera pasado por allí recientemente.");
    await imprimir("El sendero central tiene un rastro de ceniza gris que parece inalterado.");
    await imprimir("El sendero de la derecha es extrañamente limpio, sin ni una sola hoja o piedra fuera de lugar.");
    await pausa(1500);
    
    mostraropcion("SENDERO IZQUIERDO", async () => {
        limpiarPantalla();
        if (jugador.inventario.includes("Frasco de Éter")) {
            await imprimir("Un Vagabundo surge de la nada, pero eres más rápido. Rompes el frasco de éter contra el suelo.");
            await imprimir("La criatura se tambalea confundida por los vapores químicos, dándote tiempo para correr hacia la cima.");
            // Gastar el éter
            const idx = jugador.inventario.indexOf("Frasco de Éter");
            jugador.inventario.splice(idx, 1);
            actualizarPanelInfo(jugador.clase);
            await pausa(1500);
            escenaAltar();
        } else {
            await imprimir("¡Un Vagabundo surge del vacío y te alcanza con sus garras!");
            await recibirDaño(2, 2);
            await avanzarReloj(1);
            escenaAltar();
        }
    });
    
    mostraropcion("SENDERO CENTRAL", async () => {
        limpiarPantalla();
        if (!estadoArkham.pistaCeniza) {
            await imprimir("El sendero de la ceniza parece seguro, pero no entiendes por qué. ¿Qué clase de ritual requiere ceniza?");
            await imprimir("Aun así, no ves ningún peligro inmediato, así que decides seguirlo.");
        } else {
            await imprimir("Recuerdas los desvaríos del loco: 'La ceniza de los fuegos puros... ellos no pueden cruzarla'.");
            await imprimir("Caminas con paso firme. Los Vagabundos se agitan en la oscuridad pero no se atreven a tocar el rastro gris. Llegas a la cima ileso.");
        }
        await pausa(1500);
        escenaAltar();
    });

    mostraropcion("SENDERO DERECHO", async () => {
        limpiarPantalla();
        await imprimir("Parece el camino más fácil, pero es una trampa de la Orden.");
        await imprimir("La realidad se distorsiona y te lanza contra las rocas.");
        await recibirDaño(1, 1);
        await avanzarReloj(1);
        escenaAltar();
    });
}






let visitasAltar = 0; // Para controlar la mecánica de reintentos
async function escenaAltar() {
    limpiarPantalla();
    visitasAltar++;
    if (visitasAltar === 1) {
        await imprimir("Estás frente al altar de piedra negra. Hay una barrera rodeando el círculo de menhires como la que se encontraba en la puerta de la casa de Armitage. Cinco runas diferentes brillan con una luz intermitente alrededor del círculo de menhires.");
        await imprimir("Sientes que solo una de ellas puede invertir la polaridad del ritual antes de que el portal se estabilice.");
    } else {
        await imprimir("El cántico de los cultistas se intensifica. El portal está a punto de abrirse por completo. Debes actuar rápido, a pesar del dolor.");
    }

    // Definición de los símbolos
    const simbolos = [
        { nombre: "LA ESTRELLA DE CINCO PUNTAS", correcto: true },
        { nombre: "EL OJO DE UNA SERPIENTE", correcto: false },
        { nombre: "LA RUNA DESCONOCIDA", correcto: false },
        { nombre: "EL CRÁNEO DE CABRA", correcto: false },
        { nombre: "LA LUNA LLENA", correcto: false }
    ];

    simbolos.forEach(simbolo => {
        let etiqueta = simbolo.nombre;

        mostraropcion(etiqueta, async () => {
            limpiarPantalla();
            if (simbolo.correcto) {
                await imprimir("Al tocar la runa de la ESTRELLA, un fulgor blanco recorre las líneas de energía y la barrera cae con un estruendoso sonido.");
                await imprimir("El cántico de los cultistas se transforma en gritos de agonía mientras el portal empieza a colapsar sobre sí mismo.");
                await pausa(1500);
                escenaFinal();
            } else {
                await imprimir(`Tocas el símbolo de ${simbolo.nombre}... pero el aire estalla en una descarga roja.`);
                await imprimir("No es el símbolo correcto. La energía mística te quema las manos y el ritual se acelera.");
                await recibirDaño(1, 1);
                await imprimir("A pesar del dolor, intentas tocar otra runa.");
                await pausa(1500);
                escenaAltar();
            }
        });
    });

    if (visitasAltar > 1) {
        mostraropcion("RENDIRTE ANTE EL HORROR", async () => {
            limpiarPantalla();
            await imprimir("Te arrodillas, derrotado. No quieres seguir intentando abrir la barrera.");
            await imprimir("Te quedas a ver como los cultistas terminan su cántico. El portal se abre completamente, y una presencia indescriptible emerge de la brecha dimensional.");
            await pausa(1500);
            await finalYogSothoth();
        });
    }
}









async function escenaFinal() {
    limpiarPantalla();
    await imprimir("El Líder de la Orden se interpone entre tú y el portal. Sus manos están manchadas de la sangre del sacrificio.");
    await imprimir("- '¡Es inútil! ¡Los hilos del destino ya han sido cortados!' - brama mientras alza su daga.");
    await pausa(1000);

    mostraropcion("EMBESTIR AL LÍDER Y ROMPER EL CÍRCULO", async () => {
        limpiarPantalla();
        await imprimir("Te lanzas con un rugido contra el líder, ignorando el peligro, para derribarlo y desordenar los objetos rituales.");
        
        // Requiere una prueba difícil de Fuerza o Agilidad
        const prueba = tirarDadoDificil(jugador.clase.fuerza > jugador.clase.agilidad ? "fuerza" : "agilidad");
        await pausa(1500);

        if (prueba.exito) {
            await imprimir("Logras placar al líder justo antes de que termine la invocación. El círculo se rompe y la energía acumulada lo consume a él en tu lugar.");
            await victoriaFinal();
        } else {
            await imprimir("El líder esquiva tu embestida con una agilidad sobrenatural y te clava la daga de obsidiana en el costado.");
            await imprimir("Mientras caes al suelo, ves cómo el portal se abre por completo.");
            await finalYogSothoth();
        }
    });

    // Opción: Necronomicón
    if (jugador.inventario.includes("Necronomicón")) {
        mostraropcion("RECITAR EL CÁNTICO DE CIERRE", async () => {
            limpiarPantalla();
            await imprimir("Abres el libro extraño. Las palabras prohibidas vibran en el aire.");
            await pausa(500);
            let prueba;
            if (jugador.inventario.includes("Relicario de plata")) {
                await imprimir("El relicario de tu cuello brilla, dándote la paz mental necesaria.");
                prueba = tirarDadoFacil("voluntad");
            } else {
                prueba = tirarDadoMedio("voluntad");
            }
            await pausa(1000);
            if (prueba.exito) { 
                await imprimir("El cántico resuena con poder. El líder grita de furia y dolor y el portal se desestabiliza, succionándolo a él hacia su interior.");
                victoriaFinal(); 
            } else { 
                await imprimir("Las palabras del cántico se enredan en tu mente, ese idioma no fue pensado para que un simple mortal lo comprendiera. El líder se ríe de tu fracaso mientras el portal se abre completamente.");
                finalYogSothoth(); 
            }
        });
    }

    if (jugador.inventario.includes("Pistola")) {
        mostraropcion("DISPARAR AL CORAZÓN DEL LÍDER", async () => {
            limpiarPantalla();
            await imprimir("El estruendo de la pólvora silencia los cánticos.");
            const prueba = tirarDadoFacil("fuerza");
            if (prueba.exito) { 
                await imprimir("Logras alcanzar al líder con el disparo. Los canticos cesan, y el portal comienza a cerrarse.");
                victoriaFinal(); 
            } else { 
                await imprimir("El disparo falla, y el líder se ríe de tu fracaso mientras el portal se abre completamente.");
                finalYogSothoth(); 
            }
        });
    }

    mostraropcion("SACRIFICIO HEROICO", async () => {
        limpiarPantalla();
        finalSacrificio();
    });
}



















async function victoriaFinal() {
    limpiarPantalla();
    await imprimir("UN TRUENO ENSORDECEDOR SACUDE LOS CIMIENTOS DE LA REALIDAD.", velocidadTexto+30);
    await pausa(1000);
    await imprimir("El vórtice sobre Sentinel Hill empieza a consumirse a sí mismo. Los colores imposibles se desvanecen, dejando paso al negro natural de la noche.");
    await imprimir("Los cultistas que aún quedan en pie huyen despavoridos hacia el bosque, sus cánticos convertidos en lamentos de terror.");
    await pausa(1500);
    
    await imprimir("Sientes una presión inmensa desaparecer de tu pecho. El aire vuelve a oler a lluvia y a tierra mojada, no a azufre y descomposición.");
    await imprimir("Miras hacia Arkham desde la cima. Las luces de la ciudad brillan ajenas al horror que acabas de detener. Nadie sabrá nunca tu nombre, ni lo que hiciste hoy aquí.");
    await imprimir("Si al menos Armitage siguiera vivo podrias compartir esta carga con el...", velocidadTexto+30);
    await pausa(2000);
    
    await imprimir("Eres el guardián solitario en el umbral del abismo. Una figura cansada que camina de vuelta a casa bajo la luz de una luna que, por fin, vuelve a ser solo una roca en el cielo.");
    await imprimir("--- VICTORIA ---", 100);
    
    mostraropcion("ESCRIBIR TU PROPIO ARCHIVO (REINTENTAR)", () => location.reload());
}

async function finalYogSothoth() {
    limpiarPantalla();
    await imprimir("EL RELOJ MARCA LAS 00:00. EL TIEMPO SE DETIENE.", 80);
    await pausa(1000);
    await imprimir("El cielo no se abre; se desgarra como una tela vieja. De la brecha surgen esferas de luz iridiscente y ángulos que tu cerebro no puede procesar.");
    await imprimir("Es Yog-Sothoth. Aquel que es la Puerta y la Llave. Aquel en quien el pasado, el presente y el futuro son uno solo.");
    await pausa(1500);
    
    await imprimir("Intentas gritar, pero tus cuerdas vocales se deshacen en ceniza plateada. Tu cuerpo empieza a extenderse a través de dimensiones infinitas.");
    await imprimir("Arkham, la Tierra y toda la humanidad desaparecen en un parpadeo cósmico. No hay dolor, solo la comprensión absoluta de que vuestra existencia nunca fue más que un error en el ojo de un dios ciego.");
    await pausa(2000);
    
    await imprimir("LA REALIDAD HA SIDO BORRADA.", 120);
    
    mostraropcion("ACEPTAR EL OLVIDO (REINTENTAR)", () => location.reload());
}

async function finalSacrificio() {
    limpiarPantalla();
    await imprimir("Entiendes el precio. La brecha no se cerrará con cánticos, sino con un alma.", 40);
    await pausa(1000);
    await imprimir("Te lanzas al centro del vórtice. Por un instante, ves todas las estrellas del universo y el vacío que hay entre ellas.");
    await imprimir("Tu sacrificio genera una onda de choque que sella la grieta desde dentro. Sentinel Hill queda en silencio, marcado por una explosión de luz blanca que se ve desde kilómetros de distancia.");
    await pausa(2000);
    
    await imprimir("Días después, en la Universidad Miskatonic, una estantería vacía recordará tu nombre en silencio. Arkham está a salvo, pero tú ya no perteneces a este mundo.");
    await imprimir("--- FINAL SACRIFICADO ---", 80);
    mostraropcion("REINTENTAR", () => location.reload());
}