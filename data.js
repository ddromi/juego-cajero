/* ===================================================================
   data.js — Datos y configuración del juego
   -------------------------------------------------------------------
   Este archivo es la "fuente de la verdad" para hacer crecer el juego.
   Para agregar productos, montos de extracción o niveles, editá ACÁ.
   No hace falta tocar la lógica (game.js).
   =================================================================== */

const CONFIG = {
  // Plata que el jugador tiene en el banco al empezar
  saldoBancoInicial: 1000,

  // Clave correcta del cajero (4 dígitos). Se muestra como ayuda a los chicos.
  claveCorrecta: "1234",

  // Cuántos intentos de clave antes de "tragar" la tarjeta (reinicia el cajero)
  intentosClave: 3,

  // Botones de extracción rápida que ofrece el cajero
  montosRapidos: [50, 100, 200, 500],

  // Símbolo de la moneda
  moneda: "$",

  // Sonidos activados por defecto
  sonido: true,
};

/* -------------------------------------------------------------------
   PRODUCTOS del centro comercial.
   Agregar uno nuevo es tan fácil como copiar una línea.
   - id:     identificador único (texto corto, sin espacios)
   - nombre: lo que ve el chico
   - emoji:  el dibujito
   - precio: cuánto cuesta en efectivo
   - tienda: para agrupar por local (categoría)
   ------------------------------------------------------------------- */
const PRODUCTOS = [
  // 🍔 Patio de comidas
  { id: "hamburguesa", nombre: "Hamburguesa", emoji: "🍔", precio: 45, tienda: "Comidas" },
  { id: "pizza",       nombre: "Porción de pizza", emoji: "🍕", precio: 35, tienda: "Comidas" },
  { id: "helado",      nombre: "Helado",     emoji: "🍦", precio: 25, tienda: "Comidas" },
  { id: "gaseosa",     nombre: "Gaseosa",    emoji: "🥤", precio: 20, tienda: "Comidas" },
  { id: "panchos",     nombre: "Pancho",     emoji: "🌭", precio: 30, tienda: "Comidas" },

  // 🧸 Juguetería
  { id: "peluche",     nombre: "Peluche",    emoji: "🧸", precio: 120, tienda: "Juguetería" },
  { id: "pelota",      nombre: "Pelota",     emoji: "⚽", precio: 60, tienda: "Juguetería" },
  { id: "robot",       nombre: "Robot",      emoji: "🤖", precio: 200, tienda: "Juguetería" },
  { id: "auto",        nombre: "Autito",     emoji: "🚗", precio: 80, tienda: "Juguetería" },
  { id: "rompecabezas",nombre: "Rompecabezas",emoji: "🧩", precio: 50, tienda: "Juguetería" },

  // 👕 Ropa
  { id: "remera",      nombre: "Remera",     emoji: "👕", precio: 90, tienda: "Ropa" },
  { id: "zapatillas",  nombre: "Zapatillas", emoji: "👟", precio: 150, tienda: "Ropa" },
  { id: "gorra",       nombre: "Gorra",      emoji: "🧢", precio: 40, tienda: "Ropa" },

  // 📚 Librería
  { id: "libro",       nombre: "Libro",      emoji: "📚", precio: 70, tienda: "Librería" },
  { id: "lapices",     nombre: "Lápices de colores", emoji: "🖍️", precio: 35, tienda: "Librería" },
  { id: "mochila",     nombre: "Mochila",    emoji: "🎒", precio: 110, tienda: "Librería" },
];
