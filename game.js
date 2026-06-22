/* ===================================================================
   game.js — Lógica del juego "Cajero & Compras"
   -------------------------------------------------------------------
   Arquitectura simple y escalable:
   - "estado": todo lo que cambia mientras se juega.
   - Cada PANTALLA es una función render____() que dibuja en #app.
   - irA("pantalla") cambia de escena.
   Para sumar escenas nuevas: crear render____() y un caso en irA().
   =================================================================== */

// ---------- Estado del juego ----------
const estado = {
  saldoBanco: CONFIG.saldoBancoInicial, // plata en el banco
  efectivo: 0,                          // plata en la billetera
  tarjetaInsertada: false,
  pinEscrito: "",
  intentosRestantes: CONFIG.intentosClave,
  pantalla: "inicio",
  carrito: {},                          // { idProducto: cantidad }
  tiendaActiva: null,                   // pestaña de tienda seleccionada
  comprasHechas: 0,                     // contador para celebrar logros
};

// ---------- Utilidades ----------
const $app = () => document.getElementById("app");
const plata = (n) => `${CONFIG.moneda}${n}`;

function guardar() {
  try { localStorage.setItem("cajeroJuego", JSON.stringify({
    saldoBanco: estado.saldoBanco, efectivo: estado.efectivo, comprasHechas: estado.comprasHechas
  })); } catch (e) {}
}
function cargar() {
  try {
    const d = JSON.parse(localStorage.getItem("cajeroJuego"));
    if (d) {
      estado.saldoBanco = d.saldoBanco ?? CONFIG.saldoBancoInicial;
      estado.efectivo = d.efectivo ?? 0;
      estado.comprasHechas = d.comprasHechas ?? 0;
    }
  } catch (e) {}
}

// ---------- Sonidos (Web Audio, sin archivos) ----------
let audioCtx = null;
function beep(freq = 440, dur = 0.12, tipo = "sine", vol = 0.15) {
  if (!CONFIG.sonido) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = tipo; o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g); g.connect(audioCtx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    o.stop(audioCtx.currentTime + dur);
  } catch (e) {}
}
const sonidoTecla   = () => beep(660, 0.06, "square", 0.08);
const sonidoOk      = () => { beep(523, 0.1); setTimeout(() => beep(784, 0.15), 90); };
const sonidoError   = () => beep(160, 0.3, "sawtooth", 0.12);
const sonidoMoneda  = () => { beep(880, 0.07); setTimeout(() => beep(1100, 0.09), 70); };
const sonidoFiesta  = () => { [523,659,784,1047].forEach((f,i)=>setTimeout(()=>beep(f,0.15),i*100)); };

// ---------- HUD (barra de plata) ----------
function hud() {
  return `
    <div class="hud">
      <div class="banco">
        <div class="etiqueta">🏦 En el banco</div>
        <div class="monto">${plata(estado.saldoBanco)}</div>
      </div>
      <div class="billetera">
        <div class="etiqueta">👛 En efectivo</div>
        <div class="monto">${plata(estado.efectivo)}</div>
      </div>
    </div>`;
}

// ---------- Navegación ----------
function irA(pantalla) {
  estado.pantalla = pantalla;
  render();
}

function render() {
  const p = estado.pantalla;
  if (p === "inicio") renderInicio();
  else if (p === "cajero") renderCajero();
  else if (p === "tienda") renderTienda();
  else renderInicio();
  guardar();
}

// ========================================================
//  PANTALLA: Inicio / Mapa
// ========================================================
function renderInicio() {
  $app().innerHTML = `
    ${hud()}
    <div class="titulo">🏙️ ¿A dónde vamos?</div>
    <div class="mapa">
      <div class="lugar" id="ir-cajero">
        <div class="icono">🏧</div>
        <div class="nombre">Cajero automático</div>
        <div class="desc">Sacá plata con tu tarjeta</div>
      </div>
      <div class="lugar" id="ir-tienda">
        <div class="icono">🛍️</div>
        <div class="nombre">Centro comercial</div>
        <div class="desc">Comprá cosas con tu efectivo</div>
      </div>
    </div>
    <div class="pie">Juego para aprender a usar la plata 💡</div>
  `;
  document.getElementById("ir-cajero").onclick = () => { beep(500,0.08); irA("cajero"); };
  document.getElementById("ir-tienda").onclick = () => { beep(500,0.08); estado.tiendaActiva = null; irA("tienda"); };
}

// ========================================================
//  PANTALLA: Cajero automático
//  Sub-estados según el flujo: insertar -> pin -> menu -> extraer
// ========================================================
let cajeroPaso = "insertar"; // insertar | pin | menu | extraer

function renderCajero() {
  if (!estado.tarjetaInsertada) cajeroPaso = "insertar";
  const cab = `
    <div class="cabecera">
      <button class="volver" id="volver">⬅️</button>
      <h2>🏧 Cajero</h2>
    </div>`;

  if (cajeroPaso === "insertar") {
    $app().innerHTML = `
      ${cab}
      <div class="panel">
        <div class="cajero-pantalla">¡Hola! 👋<br>Insertá tu tarjeta para empezar</div>
        <button class="btn verde" id="insertar"><span class="emoji">💳</span> Insertar tarjeta</button>
        <div class="globo">Pista 🔑 La clave secreta es <b>${CONFIG.claveCorrecta}</b></div>
      </div>`;
    document.getElementById("insertar").onclick = () => {
      sonidoOk();
      estado.tarjetaInsertada = true;
      estado.pinEscrito = "";
      estado.intentosRestantes = CONFIG.intentosClave;
      cajeroPaso = "pin";
      render();
    };
  }

  else if (cajeroPaso === "pin") {
    const puntos = estado.pinEscrito.replace(/./g, "●") || "_ _ _ _";
    $app().innerHTML = `
      ${cab}
      <div class="panel">
        <div class="cajero-pantalla">Escribí tu clave secreta 🔒<br>Te quedan ${estado.intentosRestantes} intento(s)</div>
        <div class="pin-display">${puntos}</div>
        <div class="teclado" id="teclado"></div>
      </div>`;
    construirTeclado();
  }

  else if (cajeroPaso === "menu") {
    $app().innerHTML = `
      ${cab}
      ${hud()}
      <div class="panel">
        <div class="cajero-pantalla">✅ ¡Clave correcta!<br>¿Qué querés hacer?</div>
        <button class="btn verde" id="extraer"><span class="emoji">💵</span> Sacar plata</button>
        <button class="btn" id="ver-saldo"><span class="emoji">🔍</span> Ver mi saldo</button>
        <button class="btn rojo" id="sacar-tarjeta"><span class="emoji">💳</span> Retirar tarjeta</button>
      </div>`;
    document.getElementById("extraer").onclick = () => { beep(500,0.08); cajeroPaso = "extraer"; render(); };
    document.getElementById("ver-saldo").onclick = () => {
      beep(600,0.08);
      mensajeCajero(`Tenés ${plata(estado.saldoBanco)} en el banco 🏦`);
    };
    document.getElementById("sacar-tarjeta").onclick = retirarTarjeta;
  }

  else if (cajeroPaso === "extraer") {
    const botones = CONFIG.montosRapidos.map(m => {
      const alcanza = m <= estado.saldoBanco;
      return `<button class="btn ${alcanza ? "verde" : "gris"}" data-monto="${m}" ${alcanza ? "" : "disabled"}>
                ${plata(m)}
              </button>`;
    }).join("");
    $app().innerHTML = `
      ${cab}
      ${hud()}
      <div class="panel">
        <div class="cajero-pantalla">¿Cuánta plata querés sacar? 💵</div>
        ${botones}
        <button class="btn amarillo" id="volver-menu">⬅️ Volver</button>
      </div>`;
    $app().querySelectorAll("[data-monto]").forEach(b => {
      b.onclick = () => extraer(parseInt(b.dataset.monto, 10));
    });
    document.getElementById("volver-menu").onclick = () => { beep(400,0.08); cajeroPaso = "menu"; render(); };
  }

  document.getElementById("volver").onclick = () => { beep(400,0.08); irA("inicio"); };
}

function construirTeclado() {
  const teclas = ["1","2","3","4","5","6","7","8","9","borrar","0","ok"];
  const cont = document.getElementById("teclado");
  cont.innerHTML = teclas.map(t => {
    if (t === "borrar") return `<button class="tecla borrar" data-k="borrar">⌫</button>`;
    if (t === "ok") return `<button class="tecla ok" data-k="ok">OK</button>`;
    return `<button class="tecla" data-k="${t}">${t}</button>`;
  }).join("");
  cont.querySelectorAll("[data-k]").forEach(b => {
    b.onclick = () => apretarTecla(b.dataset.k);
  });
}

function apretarTecla(k) {
  if (k === "borrar") {
    sonidoTecla();
    estado.pinEscrito = estado.pinEscrito.slice(0, -1);
    render();
    return;
  }
  if (k === "ok") {
    verificarPin();
    return;
  }
  if (estado.pinEscrito.length < 4) {
    sonidoTecla();
    estado.pinEscrito += k;
    render();
  }
}

function verificarPin() {
  if (estado.pinEscrito === CONFIG.claveCorrecta) {
    sonidoOk();
    cajeroPaso = "menu";
    render();
  } else {
    sonidoError();
    estado.intentosRestantes -= 1;
    estado.pinEscrito = "";
    if (estado.intentosRestantes <= 0) {
      // El cajero "devuelve" la tarjeta y hay que empezar de nuevo
      estado.tarjetaInsertada = false;
      cajeroPaso = "insertar";
      render();
      mensajeCajero("❌ Clave equivocada. El cajero te devolvió la tarjeta. ¡Probá otra vez!");
    } else {
      render();
      const pd = document.querySelector(".pin-display");
      if (pd) pd.classList.add("tiembla");
    }
  }
}

function extraer(monto) {
  if (monto > estado.saldoBanco) { sonidoError(); return; }
  sonidoMoneda();
  estado.saldoBanco -= monto;
  estado.efectivo += monto;
  cajeroPaso = "menu";
  render();
  mensajeCajero(`💸 ¡Listo! Sacaste ${plata(monto)}.<br>Ahora tenés ${plata(estado.efectivo)} en la billetera.`);
}

function retirarTarjeta() {
  sonidoOk();
  estado.tarjetaInsertada = false;
  cajeroPaso = "insertar";
  mensajeCajero("👋 Tarjeta retirada. ¡Gracias por usar el cajero!", () => irA("inicio"));
}

// Globo de mensaje temporal dentro del cajero
function mensajeCajero(html, alCerrar) {
  const pantalla = document.querySelector(".cajero-pantalla");
  if (pantalla) {
    pantalla.innerHTML = html;
    pantalla.classList.add("celebra");
  }
  if (alCerrar) setTimeout(alCerrar, 1400);
}

// ========================================================
//  PANTALLA: Centro comercial
// ========================================================
function tiendasDisponibles() {
  return [...new Set(PRODUCTOS.map(p => p.tienda))];
}

function renderTienda() {
  const tiendas = tiendasDisponibles();
  if (!estado.tiendaActiva) estado.tiendaActiva = tiendas[0];

  const tabs = tiendas.map(t =>
    `<button class="tab ${t === estado.tiendaActiva ? "activa" : ""}" data-tienda="${t}">${t}</button>`
  ).join("");

  const items = PRODUCTOS.filter(p => p.tienda === estado.tiendaActiva).map(p => {
    const cant = estado.carrito[p.id] || 0;
    const noAlcanza = p.precio > estado.efectivo && cant === 0;
    return `
      <div class="producto ${noAlcanza ? "no-alcanza" : ""}" data-prod="${p.id}">
        ${cant > 0 ? `<div class="badge">${cant}</div>` : ""}
        <div class="pemoji">${p.emoji}</div>
        <div class="pnombre">${p.nombre}</div>
        <div class="pprecio">${plata(p.precio)}</div>
      </div>`;
  }).join("");

  const totalCarrito = calcularTotalCarrito();
  const cantItems = Object.values(estado.carrito).reduce((a, b) => a + b, 0);

  $app().innerHTML = `
    <div class="cabecera">
      <button class="volver" id="volver">⬅️</button>
      <h2>🛍️ Centro comercial</h2>
    </div>
    ${hud()}
    <div class="tiendas-tabs">${tabs}</div>
    <div class="productos">${items}</div>
    ${cantItems > 0 ? `
      <div class="carrito-barra" id="pagar">
        <span>🛒 ${cantItems} cosa(s)</span>
        <span>Pagar ${plata(totalCarrito)} ✅</span>
      </div>` : `
      <div class="globo">Tocá una cosa para ponerla en el carrito 🛒</div>`}
  `;

  document.getElementById("volver").onclick = () => { beep(400,0.08); irA("inicio"); };
  $app().querySelectorAll("[data-tienda]").forEach(b => {
    b.onclick = () => { beep(550,0.07); estado.tiendaActiva = b.dataset.tienda; render(); };
  });
  $app().querySelectorAll("[data-prod]").forEach(el => {
    el.onclick = () => agregarAlCarrito(el.dataset.prod);
  });
  const barra = document.getElementById("pagar");
  if (barra) barra.onclick = pagar;
}

function calcularTotalCarrito() {
  return Object.entries(estado.carrito).reduce((tot, [id, cant]) => {
    const prod = PRODUCTOS.find(p => p.id === id);
    return tot + (prod ? prod.precio * cant : 0);
  }, 0);
}

function agregarAlCarrito(id) {
  const prod = PRODUCTOS.find(p => p.id === id);
  if (!prod) return;
  const totalActual = calcularTotalCarrito();
  if (totalActual + prod.precio > estado.efectivo) {
    sonidoError();
    flashGlobo(`No te alcanza la plata para eso 😅. Tenés ${plata(estado.efectivo)}. ¡Andá al cajero a sacar más!`);
    return;
  }
  sonidoMoneda();
  estado.carrito[id] = (estado.carrito[id] || 0) + 1;
  render();
}

function pagar() {
  const total = calcularTotalCarrito();
  if (total === 0) return;
  if (total > estado.efectivo) { sonidoError(); return; }

  sonidoFiesta();
  estado.efectivo -= total;
  const cantItems = Object.values(estado.carrito).reduce((a, b) => a + b, 0);
  estado.comprasHechas += cantItems;

  // Resumen de la compra
  const lista = Object.entries(estado.carrito).map(([id, cant]) => {
    const p = PRODUCTOS.find(x => x.id === id);
    return `${p.emoji} ${p.nombre} x${cant}`;
  }).join("  ");

  estado.carrito = {};

  $app().innerHTML = `
    <div class="panel celebra" style="text-align:center">
      <div style="font-size:70px">🎉</div>
      <div class="titulo">¡Compraste!</div>
      <div class="globo">${lista}</div>
      <p>Gastaste <b>${plata(total)}</b> en efectivo.</p>
      <p>Te quedan <b>${plata(estado.efectivo)}</b> en la billetera. 👛</p>
      <button class="btn verde" id="seguir">🛍️ Seguir comprando</button>
      <button class="btn" id="al-inicio">🏙️ Volver al mapa</button>
    </div>`;
  guardar();
  document.getElementById("seguir").onclick = () => { beep(500,0.08); irA("tienda"); };
  document.getElementById("al-inicio").onclick = () => { beep(500,0.08); irA("inicio"); };
}

// Mensaje rápido que aparece y desaparece (para "no te alcanza", etc.)
let globoTimer = null;
function flashGlobo(texto) {
  let g = document.getElementById("flash-globo");
  if (!g) {
    g = document.createElement("div");
    g.id = "flash-globo";
    g.className = "globo tiembla";
    g.style.position = "sticky";
    g.style.bottom = "10px";
    $app().appendChild(g);
  }
  g.innerHTML = texto;
  clearTimeout(globoTimer);
  globoTimer = setTimeout(() => { if (g) g.remove(); }, 2500);
}

// ---------- Botón de sonido ----------
function toggleSonido() {
  CONFIG.sonido = !CONFIG.sonido;
  document.getElementById("btn-sonido").textContent = CONFIG.sonido ? "🔊" : "🔇";
  if (CONFIG.sonido) beep(700, 0.1);
}

// ---------- Arranque ----------
window.addEventListener("DOMContentLoaded", () => {
  cargar();
  // Botón flotante de sonido
  const bs = document.createElement("button");
  bs.id = "btn-sonido";
  bs.className = "sonido-btn";
  bs.textContent = CONFIG.sonido ? "🔊" : "🔇";
  bs.onclick = toggleSonido;
  document.body.appendChild(bs);

  render();
});
