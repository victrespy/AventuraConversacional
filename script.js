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
        objeto_inicial: "Tomo de hechizos",
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
    inventario: []
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
        const prueba = tirarDadoMedio("voluntad");
        await pausa(1000);
        if (!prueba.exito) {
            await imprimir("...llenando tus oidos y penetrando en tu mente. El pánico te desborda.");
            recibirDaño(0, 1);
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
            recibirDaño(1, 0);
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
    if(!estadoEstudio.desesperacionActiva){
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
        await imprimir("Dentro hallas un volumen forrado en piel, su titulo dice: EL NECRONOMICÓN.");
        jugador.inventario.push("Necronomicon");
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
                recibirDaño(1, 0);
            } else {
                await imprimir("Logras esquivar la mayoría de los libros con un movimiento rápido sin perder la compostura.");
            }
            
            await pausa(500);
            await imprimir("Los libros que ahora están desparramados sobre el suelo. Inevitablemente te fijas en ellos y tu mirada intenta encontrar alguna pista de utilidad. En los libros no hay nada pero notas que en los bordes de la alfombra sobre la que han caido hay marcas de tierra fresca, como si algo hubiera estado cavando debajo.");
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
            const prueba = tirarDadoMedio("voluntad");
            await pausa(1000);
            if (prueba.exito) {
                await imprimir("Consigues soportar el horror y descubres un patrón: en cada escena aparece dibujada una estrella de cinco puntas.");
                estadoEstudio.leerInformes = true;
            } else {
                await imprimir("No puedes mas... Las imágenes son demasiado. Tu mente flaquea ante tal brutalidad.");
                recibirDaño(0, 1);
            }
            await pausa(500);
            mostraropcion("VOLVER", estudio);
        });
    }

    if (!estadoEstudio.llaveEncontrada) {
        mostraropcion("REVOLVER LOS PAPELES", async () => {
            limpiarPantalla();
            await imprimir("Mueves carpetas y cajones con prisas. Entre unos recibos viejos, aparece una llave pequeña de plata.");
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
    recibirDaño(1, 0);
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
        recibirDaño(1, 0); 
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



//=============================================================
// --- ACTO 1: EL PASILLO ---
//=============================================================

// --- ESTADO ESPECÍFICO DEL PASILLO ---
const estadoPasillo = {
    visitasPasillo: 0,
    peligro: 0,
    PELIGRO_MAXIMO: 5
};

async function pasillo() {
    limpiarPantalla();
    await imprimir("El pasillo es estrecho y oscuro, con paredes de piedra húmeda que rezuman una humedad penetrante. El aire es denso y huele a moho, tierra y algo más indescriptible que te revuelve el estómago.");
    await pausa(500);
    mostraropcion("CONTINUAR", hastaAqui);
}









async function hastaAqui(){
  limpiarPantalla();
  await imprimir("HASTA AQUI ESTA EL JUEGO", 70);
}