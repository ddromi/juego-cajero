# 🏧 Cajero & Compras — Juego para chicos (7+)

Un juego simple para que los más chicos aprendan el circuito de la plata:
ir al **cajero automático** 🏧 → insertar la tarjeta 💳 → poner la clave 🔒 →
**sacar plata** 💵 → ir al **centro comercial** 🛍️ → **gastar el efectivo** comprando cosas.

Funciona en el navegador de la **computadora o el celular**. No necesita internet ni instalar nada.

## ▶️ Cómo jugar

Abrí el archivo `index.html` con cualquier navegador (Chrome, Edge, Safari, Firefox).

- En la compu: doble clic en `index.html`.
- En el celular: copiá la carpeta y abrí `index.html`, o serví la carpeta (ver abajo).

**Clave secreta del cajero:** `1234` (aparece como pista en pantalla).

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

Casi todo se amplía editando **`data.js`** sin tocar la lógica:

- **Más productos / tiendas**: agregá líneas en `PRODUCTOS`. Una `tienda` nueva
  crea automáticamente su pestaña.
- **Montos del cajero**: editá `CONFIG.montosRapidos`.
- **Clave, saldo inicial, intentos, moneda**: en `CONFIG`.

### Ideas para próximas versiones
- Calcular el **vuelto** a mano (desafío de matemática).
- **Niveles**: precios y montos más grandes a medida que avanza.
- **Lista de compras** (misión: comprá X cosas con cierto presupuesto).
- **Monedas y billetes** para pagar con la cantidad justa.
- Sonidos/animaciones extra, avatar del jugador, idiomas.

## 📁 Archivos

| Archivo | Para qué |
|---|---|
| `index.html` | Punto de entrada |
| `styles.css` | Colores, botones grandes, diseño mobile |
| `data.js` | **Config + productos** (editá acá para sumar contenido) |
| `game.js` | Lógica: pantallas (inicio, cajero, tienda) y estado |
