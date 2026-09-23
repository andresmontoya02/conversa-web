(function () {
  "use strict";

  /* ═══════════════════════════════════════════════════════════
     DATOS DEL TUTORIAL — edita textos aquí sin tocar la lógica
     ═══════════════════════════════════════════════════════════ */

  var EJ = {
    camila: "Camila",
    mateo: "Mateo",
    carlos: "Carlos",
    solicitudId: 128,
    turnoCamila: "jueves 14:00–22:00",
    turnoMateo: "jueves 06:00–14:00",
  };

  var TEXTOS = {
    camilaHello:
      'Hola Camila, soy Andi. ¿En qué te ayudo? Responde con el número:\n' +
      '1. Cambiar turno\n' +
      '2. Cambiar día libre\n\n' +
      'Si ya tienes una solicitud en curso, escribe "cancelar" para cancelarla.',
    camilaAsk: "Quiero cambiar mi turno del jueves con Mateo 🙋",
    camilaAck:
      "Le envié tu propuesta a Mateo: cederías tu turno del " + EJ.turnoCamila +
      " a cambio de tomar el de Mateo, " + EJ.turnoMateo + ". Te aviso en cuanto responda.",
    camilaPending:
      "La otra persona aceptó. Este cambio necesita aprobación de tu manager, te aviso apenas la tengamos.",
    camilaApproved:
      "Tu cambio con Mateo quedó aprobado. Mateo se hará cargo de tu turno del " + EJ.turnoCamila + ".",
    jefeEscalation:
      "Solicitud #" + EJ.solicitudId + " necesita tu aprobación:\n" +
      "Camila cede " + EJ.turnoCamila + " → lo tomaría Mateo.\n" +
      "Responde *SI " + EJ.solicitudId + "* para aprobar o *NO " + EJ.solicitudId + "* para rechazar.",
    jefeAutoNotice:
      "Aviso: Camila y Mateo cambiaron su turno del jueves automáticamente. No necesitas hacer nada.",
  };

  var SCROLLY_COPY = {
    5: {
      aprobacion: {
        title: "El jefe aprueba el cambio",
        text: "Andi le manda la solicitud a Carlos con todos los datos. Él responde y listo.",
      },
      automatico: {
        title: "El cambio se confirma solo",
        text: "Como el modo es automático, Andi confirma el cambio al instante. Carlos solo recibe un aviso.",
      },
    },
  };

  /* Mini cuadrante: patrón de días trabajados (solo decorativo, salvo el jueves) */
  var DIAS = ["L", "M", "X", "J", "V", "S", "D"];
  var CAMILA_PATRON = [1, 0, 0, 1, 1, 0, 0]; // trabaja L, J, V
  var MATEO_PATRON = [0, 1, 0, 1, 1, 0, 1]; // trabaja M, J, V, D

  /* ═══════════════════════════════════════════════════════════
     DEFINICIÓN DE ITEMS POR CELULAR (orden = orden en el chat)
     ═══════════════════════════════════════════════════════════ */

  function bubbleItem(key, minStep, dir, text, mode) {
    return { key: key, minStep: minStep, mode: mode, kind: "bubble", dir: dir, text: text };
  }

  var JEFE_ITEMS = [
    { key: "j-config", minStep: 2, kind: "config" },
    bubbleItem("j-escalation", 5, "in", TEXTOS.jefeEscalation, "aprobacion"),
    { key: "j-escalation-buttons", minStep: 5, mode: "aprobacion", kind: "buttons" },
    bubbleItem("j-auto-notice", 5, "in", TEXTOS.jefeAutoNotice, "automatico"),
  ];

  var CAMILA_ITEMS = [
    bubbleItem("c-hello", 0, "in", TEXTOS.camilaHello),
    { key: "c-schedule", minStep: 3, kind: "schedule" },
    bubbleItem("c-ask", 4, "out", TEXTOS.camilaAsk),
    bubbleItem("c-ack", 4, "in", TEXTOS.camilaAck),
    bubbleItem("c-pending", 5, "in", TEXTOS.camilaPending, "aprobacion"),
    bubbleItem("c-approved-auto", 5, "in", TEXTOS.camilaApproved, "automatico"),
    bubbleItem("c-approved-final", 6, "in", TEXTOS.camilaApproved, "aprobacion"),
  ];

  /* ═══════════════════════════════════════════════════════════
     MOTOR — no hace falta tocar esto para editar textos
     ═══════════════════════════════════════════════════════════ */

  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var els = {
    scrolly: document.getElementById("scrolly"),
    steps: null,
    phonesWrap: document.getElementById("phonesWrap"),
    modeToggle: document.getElementById("modeToggle"),
    phoneTabs: document.getElementById("phoneTabs"),
    messagesJefe: document.getElementById("messagesJefe"),
    messagesCamila: document.getElementById("messagesCamila"),
    bannerMateo: document.getElementById("bannerMateo"),
  };

  if (!els.scrolly) return;
  els.steps = els.scrolly.querySelectorAll(".scrolly-step");

  var state = { step: -1, mode: "aprobacion" };
  var rendered = { jefe: [], camila: [] };
  var bannerShown = false;

  function applicableItems(items, step) {
    return items.filter(function (item) {
      if (item.minStep > step) return false;
      if (item.mode && item.mode !== state.mode) return false;
      return true;
    });
  }

  function isPrefix(prevKeys, nextItems) {
    if (prevKeys.length > nextItems.length) return false;
    for (var i = 0; i < prevKeys.length; i++) {
      if (prevKeys[i] !== nextItems[i].key) return false;
    }
    return true;
  }

  function makeBubble(dir, text) {
    var el = document.createElement("div");
    el.className = "bubble bubble-" + dir;
    el.textContent = text;
    return el;
  }

  function makeTyping() {
    var el = document.createElement("div");
    el.className = "bubble bubble-in bubble-typing";
    el.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    return el;
  }

  function makeButtons() {
    var wrap = document.createElement("div");
    wrap.className = "msg-buttons";
    var aprobar = document.createElement("span");
    aprobar.className = "msg-pill";
    aprobar.textContent = "Aprobar";
    aprobar.dataset.choice = "aprobar";
    var rechazar = document.createElement("span");
    rechazar.className = "msg-pill";
    rechazar.textContent = "Rechazar";
    rechazar.dataset.choice = "rechazar";
    wrap.appendChild(aprobar);
    wrap.appendChild(rechazar);
    var delay = REDUCED ? 0 : 650;
    setTimeout(function () {
      aprobar.classList.add("tapped");
    }, delay);
    return wrap;
  }

  function makeConfigCard() {
    var wrap = document.createElement("div");
    wrap.className = "config-card";
    var title = document.createElement("div");
    title.className = "config-card-title";
    title.textContent = "Configuración de turnos";
    var options = document.createElement("div");
    options.className = "config-card-options";
    ["automatico", "aprobacion"].forEach(function (mode) {
      var pill = document.createElement("span");
      pill.className = "config-pill" + (state.mode === mode ? " active" : "");
      pill.dataset.mode = mode;
      pill.textContent = mode === "automatico" ? "Automático" : "Con aprobación";
      options.appendChild(pill);
    });
    wrap.appendChild(title);
    wrap.appendChild(options);
    return wrap;
  }

  function fillScheduleInto(wrap, variant) {
    wrap.innerHTML = "";
    wrap.dataset.variant = variant;

    var head = document.createElement("div");
    head.className = "mini-schedule-row mini-schedule-head";
    var headName = document.createElement("span");
    headName.className = "mini-schedule-name";
    head.appendChild(headName);
    DIAS.forEach(function (d) {
      var cell = document.createElement("span");
      cell.className = "mini-schedule-cell";
      cell.textContent = d;
      head.appendChild(cell);
    });
    wrap.appendChild(head);

    function buildRow(nombre, patron, jueveClass, jueveText) {
      var row = document.createElement("div");
      row.className = "mini-schedule-row";
      var name = document.createElement("span");
      name.className = "mini-schedule-name";
      name.textContent = nombre;
      row.appendChild(name);
      patron.forEach(function (trabaja, i) {
        var cell = document.createElement("span");
        var isJueves = DIAS[i] === "J";
        cell.className = "mini-schedule-cell" + (trabaja ? "" : " off") + (isJueves ? " " + jueveClass : "");
        if (isJueves) cell.textContent = jueveText;
        row.appendChild(cell);
      });
      wrap.appendChild(row);
    }

    if (variant === "before") {
      buildRow(EJ.camila, CAMILA_PATRON, "", "");
      buildRow(EJ.mateo, MATEO_PATRON, "highlight-lila", "06–14");
    } else {
      buildRow(EJ.camila, CAMILA_PATRON, "highlight-lima", "06–14");
      buildRow(EJ.mateo, MATEO_PATRON, "highlight-lima", "14–22");
    }
  }

  function makeSchedule(variant) {
    var wrap = document.createElement("div");
    wrap.className = "mini-schedule";
    fillScheduleInto(wrap, variant);
    return wrap;
  }

  function scheduleVariantForStep(step) {
    return step >= 6 ? "after" : "before";
  }

  function buildItemNode(item) {
    var node;
    if (item.kind === "bubble") node = makeBubble(item.dir, item.text);
    else if (item.kind === "buttons") node = makeButtons();
    else if (item.kind === "config") node = makeConfigCard();
    else if (item.kind === "schedule") node = makeSchedule(scheduleVariantForStep(state.step));
    else node = document.createElement("div");
    node.dataset.itemKey = item.key;
    return node;
  }

  function scrollToBottom(container) {
    container.scrollTop = container.scrollHeight;
  }

  function instantRebuild(phone, items) {
    var container = phone === "jefe" ? els.messagesJefe : els.messagesCamila;
    container.innerHTML = "";
    items.forEach(function (item) {
      container.appendChild(buildItemNode(item));
    });
    scrollToBottom(container);
    rendered[phone] = items.map(function (i) { return i.key; });
  }

  function appendAnimated(phone, newItems, done) {
    var container = phone === "jefe" ? els.messagesJefe : els.messagesCamila;

    if (REDUCED) {
      newItems.forEach(function (item) {
        container.appendChild(buildItemNode(item));
      });
      scrollToBottom(container);
      done();
      return;
    }

    setActiveTab(phone);

    var i = 0;
    function next() {
      if (i >= newItems.length) {
        done();
        return;
      }
      var item = newItems[i++];
      var showTyping = item.kind === "bubble" && item.dir === "in";

      if (showTyping) {
        var typing = makeTyping();
        container.appendChild(typing);
        scrollToBottom(container);
        setTimeout(function () {
          typing.remove();
          var node = buildItemNode(item);
          node.classList.add("msg-enter");
          container.appendChild(node);
          scrollToBottom(container);
          setTimeout(next, 350);
        }, 500);
      } else {
        var node = buildItemNode(item);
        node.classList.add("msg-enter");
        container.appendChild(node);
        scrollToBottom(container);
        setTimeout(next, 350);
      }
    }
    next();
  }

  function updatePhone(phone, step, animate) {
    var itemsDef = phone === "jefe" ? JEFE_ITEMS : CAMILA_ITEMS;
    var target = applicableItems(itemsDef, step);
    var current = rendered[phone];

    if (animate && isPrefix(current, target)) {
      var newOnes = target.slice(current.length);
      rendered[phone] = target.map(function (i) { return i.key; });
      if (newOnes.length) appendAnimated(phone, newOnes, function () {});
    } else {
      instantRebuild(phone, target);
    }
  }

  function refreshSchedule(step) {
    var wrap = els.messagesCamila.querySelector('[data-item-key="c-schedule"]');
    if (!wrap) return;
    var variant = scheduleVariantForStep(step);
    if (wrap.dataset.variant !== variant) fillScheduleInto(wrap, variant);
  }

  function updateScrollyCopy() {
    var copy = SCROLLY_COPY[5][state.mode];
    var stepEl = els.scrolly.querySelector('.scrolly-step[data-step="5"]');
    if (!stepEl) return;
    var h = stepEl.querySelector("h2");
    var p = stepEl.querySelector("p");
    if (h) h.textContent = copy.title;
    if (p) p.textContent = copy.text;
  }

  function updateModeToggleUI() {
    var buttons = els.modeToggle.querySelectorAll(".mode-toggle-btn");
    buttons.forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.mode === state.mode);
    });
  }

  function updateModeToggleVisibility(step) {
    els.modeToggle.classList.toggle("visible", step >= 2);
  }

  function updatePhonesSoloClass(step) {
    els.phonesWrap.classList.toggle("solo", step === 0);
    var jefeLabel = els.phonesWrap.querySelector('.phone-slot[data-phone="jefe"] .phone-label');
    var camilaLabel = els.phonesWrap.querySelector('.phone-slot[data-phone="camila"] .phone-label');
    if (jefeLabel) jefeLabel.classList.toggle("visible", step >= 1);
    if (camilaLabel) camilaLabel.classList.toggle("visible", step >= 1);
  }

  function updateBanner(step, animate) {
    var shouldShow = step >= 6;
    if (shouldShow && !bannerShown) {
      els.bannerMateo.hidden = false;
      if (!REDUCED && animate) els.bannerMateo.classList.add("msg-enter");
      bannerShown = true;
    } else if (!shouldShow && bannerShown) {
      els.bannerMateo.hidden = true;
      els.bannerMateo.classList.remove("msg-enter");
      bannerShown = false;
    }
  }

  function setActiveTab(phone) {
    var tabs = els.phoneTabs.querySelectorAll(".phone-tab");
    tabs.forEach(function (t) {
      t.classList.toggle("active", t.dataset.target === phone);
    });
    var slots = els.phonesWrap.querySelectorAll(".phone-slot");
    slots.forEach(function (s) {
      s.classList.toggle("tab-active", s.dataset.phone === phone);
    });
  }

  function goToStep(step, animate) {
    var forward = step > state.step;
    state.step = step;
    updatePhonesSoloClass(step);
    updateModeToggleVisibility(step);
    updatePhone("jefe", step, animate && forward);
    updatePhone("camila", step, animate && forward);
    refreshSchedule(step);
    updateBanner(step, animate && forward);
  }

  function setMode(mode) {
    if (mode === state.mode) return;
    state.mode = mode;
    updateModeToggleUI();
    updateScrollyCopy();
    instantRebuild("jefe", applicableItems(JEFE_ITEMS, state.step));
    instantRebuild("camila", applicableItems(CAMILA_ITEMS, state.step));
    refreshSchedule(state.step);
    updateBanner(state.step, false);
  }

  /* Eventos */
  els.modeToggle.addEventListener("click", function (e) {
    var btn = e.target.closest(".mode-toggle-btn");
    if (!btn) return;
    setMode(btn.dataset.mode);
  });

  els.phoneTabs.addEventListener("click", function (e) {
    var btn = e.target.closest(".phone-tab");
    if (!btn) return;
    setActiveTab(btn.dataset.target);
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var step = Number(entry.target.dataset.step);
          if (step !== state.step) {
            goToStep(step, true);
          }
        }
      });
    },
    { rootMargin: "-49% 0px -49% 0px", threshold: 0 }
  );
  els.steps.forEach(function (s) {
    observer.observe(s);
  });

  /* Estado inicial */
  updateModeToggleUI();
  updateScrollyCopy();
  setActiveTab("camila");
  goToStep(0, false);
})();
