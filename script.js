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
                recibirDaño(1, 0);
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
            const prueba = tirarDadoMedio("voluntad");
            await pausa(1000);
            if (prueba.exito) {
                await imprimir("Consigues soportar el horror y descubres que un superviviente a los ataques se encuentra delirando en el manicomio de Arkham.");
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



//=================================================================================================================================
// --- ACTO 1: EL RESTO DE LA CASA (PASILLO) ---
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
                recibirDaño(1, 1);
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
            recibirDaño(2, 2);
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
            recibirDaño(2, 2);
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
    recibirDaño(1, 1);
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
let estadoArkham = {
    restauranteObservado: false,
    roboPillado: false
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

// --- ESCENA: RESTAURANTE DE VELMA (CONVERSACIÓN RAMIFICADA) ---
visitasVelma = 0;
async function escenaVelma() {
    limpiarPantalla();
    visitasVelma++;
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

    mostraropcion("PEDIR WISKEY", async () => {
        limpiarPantalla();
        await imprimir("Pides un trago de wiskey. Joe te sirve un vaso con un líquido oscuro y fuerte.");
        await pausa(500);
        await imprimir("Al beberlo, sientes un calor intenso que se extiende por tu cuerpo. El wiskey es fuerte, pero te ayuda a calmar los nervios, pero te deja un leve mareo.");
        await pausa(500);
        jugador.clase.salud_mental = Math.min(jugador.clase.salud_mental + 1, 9);
        actualizarPanelInfo(jugador.clase);
        escenaVelma();
    });
    
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
                        recibirDaño(1, 0);
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

// --- OTRAS ESCENAS ---

async function escenaPolicia() {
    limpiarPantalla();
    await avanzarReloj(1);
    await imprimir("Entras en la Comisaría y les cuentas lo que sabes. El Sheriff Anderson se ríe en tu cara.");
    await pausa(500);
    await imprimir("- ¿Monstruos invisibles? Escuche, vuelva a casa. Arkham no es lugar para locos.");
    recibirDaño(0, 1);
    await pausa(1000);
    const prueba = tirarDadoMedio("inteligencia");
    if (prueba.exito) {
        await imprimir("En una mesa junto a la puerta ves una pistola desatendida. Te vendria bien, pero es arriesgado cogerla sin permiso...");
        mostraropcion("COGER LA PISTOLA", async () => {
            const pruebaSigilo = tirarDadoMedio("agilidad");
            if (!pruebaSigilo.exito) {
                await imprimir("¡El Sheriff te ve intentando coger la pistola! Se levanta furioso y te echa de la comisaría.");
                recibirDaño(1, 0);
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

async function escenaHospital() {
    limpiarPantalla();
    await avanzarReloj(1);
    await imprimir("El Hospital de Santa María es silencioso. Las enfermeras te miran con compasión.");
    mostraropcion("DESCANSAR Y CURARSE (Cuesta 2 horas)", async () => {
        await avanzarReloj(1);
        jugador.clase.salud_fisica = Math.min(jugador.clase.salud_fisica + 2, 9);
        jugador.clase.salud_mental = Math.min(jugador.clase.salud_mental + 1, 9);
        actualizarPanelInfo(jugador.clase);
        await imprimir("Te sientes mucho mejor, pero la noche ha avanzado peligrosamente.");
        await pausa(2000);
        mostraropcion("SALIR", mapaArkham);
    });
    mostraropcion("HABLAR CON LA ENFERMERA", async () => {
        await imprimir("La enfermera te escucha con mucha empatia y te cuenta unos rumores sobre un paciente que llegó hace unos días con heridas extrañas. Dijo algo sobre 'ser perseguido por sombras'.");
        await imprimir("El paciente está en el ala este del manicomio, pero nadie se atreve a acercarse a él. Dicen que grita por las noches y que su habitación está llena de símbolos extraños.");
        mostraropcion("SALIR", mapaArkham);
    });
}

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
            mostraropcion("COMPRAR CAMARA FOTOGRAFICA", async () => {
                jugador.inventario.push("Cámara");
                const idx = jugador.inventario.indexOf("Bolsa de dinero");
                jugador.inventario.splice(idx, 1);
                actualizarPanelInfo(jugador.clase);
                mostraropcion("SALIR", mapaArkham);
            });
            mostraropcion("COMPRAR RELICARIO DE PLATA", async () => {
                jugador.inventario.push("Relicario");
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

async function escenaMuelles() {
    limpiarPantalla();
    await avanzarReloj(1);
    await imprimir("Los muelles están cubiertos por una niebla espesa que oculta el agua negra.");
    await imprimir("Encuentras cajas con el mismo símbolo que Joe describió. Dentro hay túnicas y símbolos de piedra.");
    await pausa(2000);
    mapaArkham();
}

async function escenaMiskatonic() {
    limpiarPantalla();
    await avanzarReloj(1);
    await imprimir("En la Biblioteca Orne encuentras el 'Cántico de Cierre'.");
    jugador.inventario.push("Cántico de Cierre");
    actualizarPanelInfo(jugador.clase);
    await pausa(2000);
    mapaArkham();
}

async function escenaManicomio() {
    limpiarPantalla();
    await avanzarReloj(1);
    await imprimir("Un loco grita: '¡A las doce! ¡Cuando las sombras no tengan dueño!'");
    await imprimir("[HORA CONFIRMADA DEL RITUAL: 24:00]");
    await pausa(2000);
    mapaArkham();
}


// ==============================================================
// --- ACTO 3: EL RITUAL EN SENTINEL HILL ---
// ==============================================================

async function finalRitualPronto() {
    limpiarPantalla();
    await imprimir("ACTO 3: EL UMBRAL DE LA LOCURA", 70);
    await pausa(1000);
    await imprimir("Subes la ladera de Sentinel Hill. El aire vibra con una frecuencia que hace que tus dientes castañeen.");
    await imprimir("Ves el círculo de menhires. Los cultistas entonan un cántico que desgarra el espacio.");
    await pausa(1000);
    escenaAscenso();
}

// Escena 1: Sigilo y Observación
async function escenaAscenso() {
    limpiarPantalla();
    await imprimir("Debes acercarte al altar sin ser detectado por los Vagabundos que patrullan la zona.");
    await imprimir("Ves tres senderos posibles entre las rocas.");
    
    mostraropcion("SENDERO IZQUIERDO (Hierba aplastada)", async () => {
        await imprimir("Un Vagabundo Dimensional surge de la nada. ¡Te ha detectado!");
        recibirDaño(2, 2);
        await avanzarReloj(1); 
        await imprimir("Logras escapar herido hacia el altar.");
        escenaAltar();
    });

    mostraropcion("SENDERO CENTRAL (Rastro de ceniza gris)", async () => {
        await imprimir("Sigues el rastro de ceniza, el mismo que viste en tu casa. Sabes que aquí la membrana es débil.");
        await imprimir("Logras rodear a las criaturas sin que noten tu presencia.");
        escenaAltar();
    });

    mostraropcion("SENDERO DERECHO (Extrañamente limpio)", async () => {
        await imprimir("El sendero parece seguro, pero una trampa mística te atrapa.");
        recibirDaño(1, 1);
        await avanzarReloj(1);
        escenaAltar();
    });
}

// Escena 2: El Sello de las Piedras
async function escenaAltar() {
    limpiarPantalla();
    await imprimir("Estás frente al altar. Los cultistas están en trance. La Puerta está al 90%.");
    await imprimir("Hay tres piedras rúnicas que canalizan la energía. Debes desactivarlas.");

    if (jugador.inventario.includes("Necronomicón")) {
        await imprimir("El fragmento del Necronomicón en tu bolsillo empieza a brillar con una luz mortecina.");
        await imprimir("- Los símbolos de los Muelles... - recuerdas -. El primero es la Estrella.");
    }

    mostraropcion("ACTIVAR SÍMBOLOS (Inteligencia)", async () => {
        const prueba = tirarDadoDificil("inteligencia");
        if (prueba.exito) {
            await imprimir("Consigues invertir el flujo de energía. Los cultistas gritan de dolor mientras el portal retrocede.");
            escenaFinal();
        } else {
            await imprimir("Una descarga eléctrica te lanza hacia atrás. El ritual avanza.");
            recibirDaño(2, 0);
            await avanzarReloj(1);
            escenaFinal();
        }
    });
}

// Escena 3: El Último Cántico
async function escenaFinal() {
    limpiarPantalla();
    await imprimir("El líder de la Orden te ve. Alza una daga de obsidiana.");
    await imprimir("- ¡Demasiado tarde, mortal! ¡Aquel de los Ángulos ya está aquí! -");
    await pausa(1000);

    if (jugador.inventario.includes("Cántico de Cierre")) {
        mostraropcion("RECITAR EL CÁNTICO DE CIERRE", async () => {
            limpiarPantalla();
            await imprimir("Empiezas a leer las palabras prohibidas. El aire se vuelve sólido.");
            const prueba = tirarDadoMedio("voluntad");
            if (prueba.exito) {
                victoriaFinal();
            } else {
                await imprimir("Tu voz se quiebra por el horror. La energía del portal te consume.");
                finalYogSothoth();
            }
        });
    }

    if (jugador.inventario.includes("Pistola")) {
        mostraropcion("DISPARAR AL LÍDER", async () => {
            limpiarPantalla();
            await imprimir("El estruendo de la pistola interrumpe el cántico. El líder cae, pero el portal se vuelve inestable.");
            const prueba = tirarDadoDificil("fuerza");
            if (prueba.exito) {
                await imprimir("Aprovechas el caos para empujar el altar. El Umbral colapsa.");
                victoriaFinal();
            } else {
                await imprimir("Los Vagabundos te despedazan antes de que puedas terminar el trabajo.");
                finalizarPartida();
            }
        });
    }

    mostraropcion("SACRIFICIO HEROICO", async () => {
        limpiarPantalla();
        await imprimir("Te lanzas al centro del vórtice para romper el círculo con tu propia presencia.");
        await imprimir("La realidad se corrige con un estallido insoportable.");
        await pausa(2000);
        await imprimir("Salvaste el mundo... pero a un coste que nadie conocerá jamás.");
        await imprimir("--- FINAL SACRIFICADO ---");
        mostraropcion("REINTENTAR", () => location.reload());
    });
}

// --- FINALES ---

async function victoriaFinal() {
    limpiarPantalla();
    await imprimir("EL PORTAL SE CIERRA CON UN TRUENO QUE SACUDE LA TIERRA.", 80);
    await pausa(1000);
    await imprimir("Los cultistas desaparecen en el vacío. Arkham vuelve a la normalidad.");
    await imprimir("Has detenido a la Orden de los Ángulos. Por ahora.");
    await imprimir("--- VICTORIA ---", 100);
    mostraropcion("REINTENTAR", () => location.reload());
}

async function finalYogSothoth() {
    limpiarPantalla();
    await imprimir("EL RELOJ MARCA LAS 00:00.", 120);
    await pausa(1000);
    await imprimir("Yog-Sothoth ha llegado. La Tierra no es más que un grano de arena en su ojo infinito.");
    await imprimir("Tu cuerpo se desintegra. EL MUNDO HA SIDO BORRADO.");
    await pausa(2000);
    finalizarPartida();
}