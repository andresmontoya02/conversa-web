# Conversa — Design System

> Fuente de verdad de identidad de marca para cualquier agente de código o diseñador que trabaje en productos de Conversa. No rediseña nada por sí solo: documenta las reglas que cualquier implementación debe respetar.

## 1. Marca

**Conversa** es un producto de agentes de IA que automatizan por WhatsApp tareas operativas de cualquier negocio (turnos, reservas, pedidos, soporte). Cada tarea la resuelve un agente con nombre propio:

- **Andi** — agenda turnos. En producción.
- **Mesa** — gestiona reservas. Próximo lanzamiento.

Conversa es la marca paraguas; Andi y Mesa son sub-marcas / personajes dentro de esa misma familia visual.

### Tagline y firma

- Tagline principal: **"Tu operación, sin el drama."**
- Firma secundaria: **"Conversa y punto."**

Usar el tagline en heroes, landing y materiales de venta. La firma secundaria funciona como cierre (footer, firma de emails, despedida de flows) — no como headline.

### Tono de voz

- Joven, moderno, directo. Referencia: Revolut.
- Cero jerga corporativa ("soluciones end-to-end", "sinergias", "empoderar"). Frases cortas, verbos en imperativo, sin relleno.
- Le habla a dueños/managers de negocios ocupados que revisan todo desde el celular — cada oración debe sobrevivir una lectura de 3 segundos en una pantalla chica.
- Confianza sin solemnidad: Conversa resuelve el problema operativo, no vende "transformación digital".

## 2. Símbolo / Isotipo

- **Símbolo Conversa**: una "C" dibujada como anillo abierto que evoca una burbuja de chat, con un **punto lima** cerrando la curva (como el puntero de "enviar" o el estado "en línea").
- **Símbolo Andi**: una "A" con el mismo punto lima integrado en la barra horizontal de la letra — mantiene el lenguaje visual del punto lima como firma de toda la familia de agentes.
- Futuras sub-marcas (Mesa, etc.) deben seguir el mismo patrón: forma de letra + punto lima como marca de "agente activo".
- El punto lima nunca cambia de color — es el elemento de reconocimiento de marca, no un acento decorativo intercambiable.

## 3. Color

| Rol semántico | Nombre  | Hex       | Uso |
|---|---|---|---|
| Primario / marca | Lila | `#CFC6FB` | Fondos de marca, superficies destacadas, elementos de identidad (no botones de acción primaria de alto contraste). |
| Acento / CTA | Lima | `#E8F76B` | Punto del isotipo, micro-interacciones, badges de estado ("en línea", "activo"), acentos que piden atención puntual. Usar con moderación — es un acento, no un color de fondo grande. |
| Texto / fondo oscuro | Tinta | `#0A0A0B` | Texto principal sobre fondo claro, fondos oscuros en secciones tipo landing/fintech, footers. |
| Fondo | Papel | `#FFFFFF` | Fondo base en superficies claras (dashboard, UI de producto). |
| Neutro / texto secundario | Gris | `#6E6B78` | Texto secundario, labels, bordes sutiles, estados deshabilitados. |

Reglas de uso:
- Lima sobre Tinta o sobre Lila funciona como acento de alto contraste; evitar lima sobre papel blanco puro para texto (problema de contraste/legibilidad).
- Tinta es el color de texto por defecto sobre fondos claros; Papel es el texto por defecto sobre Tinta.
- No introducir colores fuera de esta paleta sin actualizar este documento. Si se necesitan estados (error, éxito, warning), derivarlos de esta paleta o documentarlos aquí antes de usarlos en código.

## 4. Tipografía

| Uso | Familia | Peso sugerido |
|---|---|---|
| Títulos, wordmark, hero copy | **Space Grotesk** | 500–700 |
| UI, cuerpo de texto, formularios, tablas | **Inter** | 400–600 |

Jerarquía:
- H1 / hero: Space Grotesk, tracking ajustado, tamaños grandes en mobile-first (pensar primero en 375–414px de ancho).
- H2–H4: Space Grotesk, peso medio.
- Body / UI / labels / inputs: Inter, nunca Space Grotesk para bloques largos de texto (Space Grotesk es una fuente de display, no de lectura extensa).
- Números/datos (dashboard, precios): Inter con tabular numbers cuando se comparan cifras.

## 5. Layout y espaciado

- **Mobile-first, siempre.** El público objetivo (dueños/managers de negocio) revisa todo desde el celular. Diseñar y verificar primero en viewport mobile antes que desktop.
- Grid y espaciado consistentes (escala de 4/8px). Preferir sistemas de espaciado predecibles sobre valores arbitrarios.
- Alineación deliberada: todo elemento se alinea a algo (grid, borde, centro óptico) — nunca posicionamiento accidental.
- Jerarquía visual clara: un solo elemento dominante por vista/sección: no competir por atención con múltiples acentos lima a la vez.
- Touch targets ≥ 44px en mobile (ver `web-guidelines` skill para el checklist completo de accesibilidad/responsive).

## 6. Componentes

- **Botones**: forma simple, radios consistentes (no mezclar esquinas muy redondeadas con muy rectas en el mismo flujo). CTA primario usa Lima o Tinta según contraste del fondo; nunca dos CTAs de igual peso visual compitiendo en la misma vista.
- **Burbujas de chat / mockups de WhatsApp**: elemento recurrente de la marca (Conversa vive dentro de WhatsApp) — usar el punto lima para indicar mensajes del agente o estados "enviado/leído" cuando sea relevante.
- **Badges de estado** ("en producción", "próximo"): usar Lima para "activo/disponible" y Gris para "próximo/inactivo".
- **Cards / superficies**: Papel o Lila como fondo de superficie, nunca lima como fondo de superficie grande.

## 7. Referencia estructural — sitio web (conversa-web / landing)

Este repo es la landing pública de Conversa. Referencia estructural: estilo **"Going"** en **tema claro** (bandas de color alternadas, botones píldora, titulares con tracking editorial), con la identidad Conversa de las secciones 1–6. La landing vive en `index.html` + `css/home.css` + `js/home.js`; el login en `login.html` + `css/login.css` + `js/login.js`.

Ritmo de la página: nav isla tinta → hero papel → banda lila (agentes) → papel (principios) → bloque tinta (cierre) → footer tinta.

- **Nav tipo isla flotante**: píldora en Tinta (`#0A0A0B`) separada 12px del borde superior y de los lados, sticky, con sombra suave; isotipo Conversa con punto lima, enlaces y CTA lima. Las anclas usan `scroll-padding-top` igual al borde inferior de la isla.
- **Hero blanco (Papel)**: titular grande en Space Grotesk con **tracking amplio**, con **"sin el drama." resaltado en lima** (marcador detrás del texto). A la derecha, **mockup de chat de WhatsApp** con Andi en acción sobre un disco lila — no un screenshot de dashboard, no una ilustración abstracta genérica.
- **Banda lila de agentes**: sección con fondo Lila y **3 tarjetas** (Andi — disponible, Mesa — próximamente, "Tu próximo agente" en Tinta).
- **Principios ("Por qué WhatsApp")**: tarjetas en **lila suave**; en móvil **se deslizan** en horizontal (carrusel con scroll-snap), en tablet/desktop pasan a grilla.
- **Cierre "Conversa y punto."** en un **bloque Tinta** redondeado, con CTA lima.
- **Footer en Tinta**, simple — links esenciales, sin mega-footer de 5 columnas.
- **Botones píldora** (radio completo) en toda la página.
- **Movimiento**: entrada suave (fade-up de 16px, solo `transform`/`opacity`) al aparecer cada bloque en pantalla, con IntersectionObserver. Respeta `prefers-reduced-motion` y el contenido se ve completo aunque el JS no corra.
- **Login (`login.html`)**: pantalla dividida **tinta / blanco**. En desktop, columna tinta (~42%) con logo, titular "Tu operación." (blanco) / "Sin el drama." (lila), bajada y firma "Conversa y punto." con punto lima; columna blanca con el formulario (inputs de radio 16px con anillo lila al foco, botón píldora tinta "Entrar") y botón flotante lima de WhatsApp para soporte. En móvil, bloque tinta corto arriba y el formulario debajo. Un solo login para todos, sin selector de rol; `noindex`.
- **Sin pasos numerados** ("1. Conectá tu WhatsApp, 2. Configurá..., 3. Listo") — evitar el patrón de landing SaaS genérica de 3 pasos.
- **Sin testimonios** — todavía no hay sección de logos de clientes ni citas.
- Todo lo demás (paleta, tipografía, tono, componentes) sigue las secciones 1–6 de este documento.

## 8. Página de Andi (`andi.html`)

Página del agente Andi, con el mismo nav isla, cierre "Conversa y punto." y footer de la landing (`css/home.css`); lo propio de la página vive en `css/andi.css` y el demo en `js/andi-demo.js`.

- **Hero estilo Pop Site**: todo centrado. Badge de borde fino con el isotipo de Andi, **titular gigante** en Space Grotesk 700 con **letras juntas** (tracking negativo, interlineado apretado) — "Cambios de turno **sin el drama.**" con "sin el drama." **resaltado en lima** — subtítulo corto y dos botones píldora (tinta y con borde).
- **Abanico de 3 celulares**: Camila pide el cambio, Carlos lo aprueba (al centro, al frente) y Mateo queda al día. Los laterales van girados y un poco más abajo; cada celular tiene su propio marco y fondo de chat. En móvil el abanico se compacta y sin rótulos.
- **"Todo pasa en WhatsApp."**: titular gigante centrado y **3 tarjetas con borde fino negro (1px tinta), sin sombra**, cada una con una vista previa sobre lila suave (mini-cuadrante, mini-chat, solicitud con Aprobar/Rechazar).
- **Demo (scrollytelling)**: los pasos de texto avanzan al hacer scroll y los celulares del jefe y de Camila quedan fijos **sobre un disco lila** con el anillo del isotipo (como el hero de la landing). Selector Automático / Con aprobación, botones Aprobar / Rechazar dentro del chat, mini-cuadrante que se actualiza y notificación de Mateo arriba de la pantalla. En móvil, pestañas Jefe / Camila.
- Sin animaciones con `prefers-reduced-motion`; el demo muestra los mensajes al instante.

## 9. Resumen rápido para agentes de código

1. Mobile-first siempre — verificar en viewport chico antes que en desktop.
2. Paleta cerrada: Lila `#CFC6FB`, Lima `#E8F76B`, Tinta `#0A0A0B`, Papel `#FFFFFF`, Gris `#6E6B78`. No inventar colores nuevos.
3. Space Grotesk para títulos, Inter para todo lo demás.
4. Tono: directo, sin jerga corporativa, estilo Revolut.
5. Tagline: "Tu operación, sin el drama." Firma secundaria: "Conversa y punto."
6. El punto lima es la firma visual de "agente activo" — protegerlo, no reutilizarlo como decoración genérica.
7. (Este repo) Referencia estructural = estilo Going en tema claro: nav isla flotante en tinta, hero blanco con "sin el drama." en lima + mockup de WhatsApp, banda lila de agentes, cierre tinta, botones píldora, fade-up suave al hacer scroll, login de pantalla dividida tinta/blanco; sin pasos numerados, sin testimonios, footer simple.
