# 🏙️ Mi Ciudad — Cajero & Shopping (Juego para chicos 7+)

Un mundo para que los más chicos aprendan el circuito de la plata:
elegís un **personaje pro** 🧑‍🎤 que **camina** por la ciudad → vas al **cajero
automático** 🏧 → insertás la tarjeta 💳 → ponés tu clave secreta 🔒 →
**sacás plata** 💵 → entrás al **centro comercial** 🏬 y **lo recorrés
caminando** (vidrieras, escaleras mecánicas, **patio de comidas** 🍽️ y gente
haciendo sus cosas) → entrás a una tienda → comprás y, si querés,
**calculás el vuelto** 🧮 vos mismo.

Funciona en el navegador de la **computadora o el celular**. No necesita internet ni instalar nada.

## ✨ Novedades de esta versión

- **Personajes "pro"** dibujados con CSS (no emojis): piel, pelo, ropa,
  accesorios y **animación de caminata** real. 10 para elegir.
- **Autos más grandes** y mejor dibujados circulando por la calle.
- **Centro comercial recorrible**: caminás por adentro con ◀️ ▶️ o tocando el
  piso, pasás por **8 locales** con vidriera, **escalera mecánica**, segundo
  piso, plantas y **patio de comidas** con mesas.
- **Más personajes con vida**: gente sentada comiendo, otros paseando.
- **La clave del cajero NO se muestra** en pantalla (la sabe el adulto).
- **Desafío del vuelto** 🧮: antes de pagar el juego pregunta *"¿Vas a calcular
  el vuelto?"*. Si decís que sí, elegís entre varias opciones cuánto cambio te
  tienen que dar (con pista si te cuesta).
- **🐾 Veterinaria "Salud Animal"**: comprás una mascota (🐶 🐱 🐠) en la tienda
  **Mascotas** y la llevás a la veterinaria para **bañarla, cortarle el pelo,
  curarla/vacunarla y darle de comer**. Cada cuidado cuesta plata, sube una
  barra (Limpieza / Pelo / Salud / Ánimo) y tiene su animación; cuando la
  mascota queda perfecta, ¡festejo y recompensa! La mascota se guarda sola.
- **🐶 La mascota te sigue**: una vez adoptada, **camina al lado tuyo** por la
  ciudad. Si necesita cuidados muestra un globito (🛁/🍖/❤️/✂️) para avisarte.
- **⏳ Las mascotas se cuidan solas… ¡o no!**: con el paso del tiempo se van
  **ensuciando y poniendo con hambre**, así que hay que volver a la veterinaria
  cada tanto.
- **📋 Lista de compras (misión)**: el juego te da una lista de cosas para
  comprar con un **presupuesto**. Tocás el botón 📋 (en la ciudad y en el
  shopping) para ver la lista y el progreso; cuando la completás sin pasarte,
  ganás un premio y aparece una lista nueva.

## ▶️ Cómo jugar

Abrí el archivo `index.html` con cualquier navegador (Chrome, Edge, Safari, Firefox).

- En la compu: doble clic en `index.html`.
- En el celular: copiá la carpeta y abrí `index.html`, o serví la carpeta (ver abajo).

**Clave secreta del cajero:** `1234`. ⚠️ Ya **no** se muestra en pantalla
(para que sea un secreto que enseña el adulto). Se puede cambiar en
`CONFIG.claveCorrecta` dentro de `index.html`.

### Servirlo en red local (opcional, para abrir desde el celu)
Desde esta carpeta:

```bash
python3 -m http.server 8000
```

Y desde el celular (en la misma wifi) entrá a `http://IP-DE-LA-PC:8000`.

## 🎮 Cómo se juega (el circuito)

1. **Cajero** 🏧: insertá la tarjeta → escribí la clave `1234` → "Sacar plata" → elegí un monto.
2. La plata pasa del **banco** 🏦 a tu **billetera** 👛 (efectivo).
3. **Centro comercial** 🛍️: elegí cosas. Solo podés comprar si te alcanza el efectivo.
4. Pagás → festejo 🎉 → te queda el vuelto en la billetera.

Si no te alcanza, el juego te avisa y te manda de vuelta al cajero. 💡
El progreso (plata) se **guarda solo** en el navegador.

## 🧱 Cómo hacerlo crecer (escalable)

Todo el juego vive en **`index.html`** (un solo archivo). Arriba del `<script>`
están los **datos editables** sin tocar la lógica:

- **Más productos / tiendas**: agregá líneas en `PRODUCTOS`. Si querés que la
  tienda nueva tenga vidriera adentro del shopping, sumala también a
  `TIENDAS_MALL` (con su `emoji`, `color` y posición `x`). Una tienda con
  `vet:true` abre la veterinaria en vez de un catálogo.
- **Mascotas adoptables**: editá `MASCOTAS_ADOPTABLES`. **Cuidados de la vet**:
  editá `SERVICIOS_VET` (nombre, emoji, qué barra sube y cuánto cuesta).
- **Personajes**: agregá objetos a `AVATARES` (piel, pelo, ropa, accesorio).
- **Montos del cajero**: editá `CONFIG.montosRapidos`.
- **Billetes del desafío del vuelto**: editá `BILLETES`.
- **Clave, saldo inicial, intentos, moneda**: en `CONFIG`.

### Ideas para próximas versiones
- **Niveles**: precios y montos más grandes a medida que avanza.
- **Lista de compras** (misión: comprá X cosas con cierto presupuesto).
- **Monedas y billetes** para pagar con la cantidad justa.
- Más pisos en el shopping, idiomas, logros.

> Nota: `game.js`, `data.js` y `styles.css` son de una versión anterior y ya no
> se usan (todo está integrado en `index.html`).

## 📁 Archivos

| Archivo | Para qué |
|---|---|
| `index.html` | Punto de entrada |
| `styles.css` | Colores, botones grandes, diseño mobile |
| `data.js` | **Config + productos** (editá acá para sumar contenido) |
| `game.js` | Lógica: pantallas (inicio, cajero, tienda) y estado |
