---
name: web-guidelines
description: Checklist de responsive / mobile-first / accesibilidad para UI web de Conversa, basado en las Web Interface Guidelines de Vercel (vercel.com/design/guidelines). Usar antes de dar por terminada cualquier pantalla, componente o página nueva/modificada.
---

# Web Guidelines — checklist Conversa

Checklist accionable, no la guía completa. Fuente: [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines). Aplicar mobile-first: el público de Conversa revisa todo desde el celular, así que estos puntos no son opcionales en producción.

Al terminar una feature de UI, repasar estas 5 categorías antes de marcarla como lista.

## 1. Foco de teclado / accesibilidad

- [ ] Todo elemento interactivo (botón, link, input) es navegable por teclado y sigue los [WAI-ARIA Authoring Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/).
- [ ] Anillo de foco visible en todo elemento enfocable; usar `:focus-visible` (no `:focus` puro) para no molestar a usuarios de mouse.
- [ ] Headers/footers/overlays sticky nunca tapan el elemento enfocado.
- [ ] Botones de solo-ícono tienen `aria-label` descriptivo.
- [ ] Jerarquía de `<h1>`–`<h6>` correcta; existe un link "Skip to content" si hay navegación repetitiva.
- [ ] Nada depende solo del color para comunicar estado (agregar texto/ícono además del color).
- [ ] Se usan elementos nativos (`button`, `a`, `label`) antes que `div`/`span` + `aria-*`.
- [ ] Links de navegación son `<a>`/`<Link>` reales (Cmd/Ctrl+click, click medio, "abrir en pestaña nueva" deben funcionar) — nunca `<div onClick>`.

## 2. Breakpoints y layout responsive

- [ ] Verificado en mobile, laptop y ultra-wide (mínimo: 375px, ~768px, ~1440px+).
- [ ] Layout usa flex/grid intrínseco — evitar medir tamaños con JS cuando CSS alcanza.
- [ ] Se respetan las safe areas (notch/insets) con `env(safe-area-inset-*)` donde aplique.
- [ ] No hay scrollbars accidentales por overflow sin controlar.
- [ ] El diseño resiste contenido corto, promedio y muy largo (nombres de negocios, mensajes de WhatsApp) sin romper el layout.
- [ ] Estados vacíos, de error y de carga están diseñados — no solo el "happy path".

## 3. Touch targets (mobile)

- [ ] Objetivo táctil mínimo de **44px** en mobile (WCAG/Vercel: si el elemento visual es más chico, el hit-area igual debe llegar a ese mínimo, expandiéndolo).
- [ ] `<input>` tiene `font-size` ≥ 16px en mobile para evitar el auto-zoom de iOS Safari.
- [ ] `touch-action: manipulation` en controles para evitar el doble-tap-zoom accidental.
- [ ] No hay "zonas muertas": si una parte de un control parece clickeable, lo es.
- [ ] Checkboxes/radios comparten un único hit-target grande junto con su label (no dos zonas separadas).

## 4. Performance de imágenes

- [ ] Imágenes above-the-fold se precargan; el resto usa lazy-load.
- [ ] Toda imagen tiene dimensiones explícitas (o aspect-ratio reservado) para evitar layout shift (CLS).
- [ ] Formatos optimizados (WebP/AVIF) y tamaños servidos acordes al viewport — nada de servir una imagen de escritorio sin resize a un celular.
- [ ] Animaciones tipo loop cortas usan `<video autoplay muted loop playsinline>` en vez de GIF.

## 5. Manejo de formularios

- [ ] Enter envía el formulario cuando hay un único input enfocado; en `<textarea>`, Enter inserta salto de línea y ⌘/Ctrl+Enter envía.
- [ ] Todo control tiene `<label>` asociado (para lectores de pantalla y para que el click en el label enfoque el control).
- [ ] No se bloquea el pegado (paste) en inputs/textareas.
- [ ] No se pre-deshabilita el submit — se permite enviar incompleto y se muestra el error correspondiente; foco va al primer error.
- [ ] `autocomplete` e `inputmode`/`type` correctos por campo (tel, email, etc.) para mejorar el teclado mobile y el autofill.
- [ ] Errores se muestran junto al campo correspondiente, con lenguaje que indica cómo resolverlos (no solo "campo inválido").
- [ ] Placeholder = ejemplo de valor, no una instrucción disfrazada de contenido.

---

Si una regla de esta lista entra en conflicto con una decisión de producto ya tomada, documentar la excepción en el PR — no borrar el ítem del checklist.
