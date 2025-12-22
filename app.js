/* ============================================================
   ESTADO
=========================================================== */

let respuestas = {};
let datosGenerales = { medico: null };

/* ============================================================
   BLOQUES
=========================================================== */

const bloques = {
  form2: [
    { t: "¿El recinto cuenta con temperatura estable?", g: "muygrave" },
    { t: "¿Hay circulación de aire natural (ventilación cruzada)?", g: "leve" },
    { t: "¿El espacio posee aire acondicionado en funcionamiento?", g: "medio" },
    { t: "¿Posee ventiladores funcionando?", g: "leve" }
  ],
  form3: [
    { t: "¿La fachada principal está orientada al norte?", g: "medio" },
    { t: "¿La menor cantidad de aberturas se orientan al oeste?", g: "medio" },
    { t: "¿El área permite el acceso seguro de personas con movilidad reducida?", g: "grave" }
  ],
  form4: [
    { t: "¿El material del techo evita la transferencia de calor al recinto?", g: "grave" },
    { t: "¿El recinto posee planta superior?", g: "medio" }
  ],
  form5: [
    { t: "¿Posee toldos, cortinas o elementos de sombra?", g: "leve" },
    { t: "¿Posee vegetación / edificios / medianeras al norte?", g: "medio" },
    { t: "¿Posee vegetación / edificios / medianeras al oeste?", g: "medio" }
  ],
  form6: [
    { t: "¿Cuenta con aberturas altas para permitir la salida del aire caliente?", g: "leve" },
    { t: "¿Posee tela mosquitera?", g: "leve" }
  ],
  form7: [
    { t: "¿El punto cuenta con disponibilidad de agua fría?", g: "muygrave" },
    { t: "¿Se dispone de un área de reposo o espera?", g: "medio" },
    { t: "¿El espacio está preparado para futura instalación de energía solar?", g: "medio" }
  ]
};

/* ============================================================
   MAPA DE MEJORAS
=========================================================== */

const mapaMejoras = {
  "form2_1": ["Agregar ventilación cruzada o extractores."],
  "form2_2": ["Instalar o reparar aire acondicionado."],
  "form2_3": ["Instalar o reparar ventiladores."],
  "form3_2": ["Adaptar accesos para movilidad reducida."],
  "form4_0": ["Incorporar aislación térmica en cubierta."],
  "form5_0": ["Agregar toldos o elementos de sombra."],
  "form7_0": ["Incorporar dispenser de agua fría."]
};

/* ============================================================
   FORMULARIOS
=========================================================== */

function generarFormularios() {
  Object.entries(bloques).forEach(([id, preguntas]) => {
    const cont = document.getElementById(id);
    if (!cont) return;

    preguntas.forEach((p, i) => {
      cont.insertAdjacentHTML("beforeend", `
        <div class="pregunta">
          <strong>${p.t}</strong>
          <div class="opciones">
            <button class="btn-resp btn-si" onclick="responder('${id}',${i},'si',this)">Sí</button>
            <button class="btn-resp btn-no-${p.g}" onclick="responder('${id}',${i},'no',this)">No</button>
          </div>
        </div>
      `);
    });
  });
}

function responder(b, i, v, btn) {
  respuestas[`${b}_${i}`] = v;
  btn.parentElement.querySelectorAll(".btn-resp").forEach(b => b.classList.remove("seleccionado"));
  btn.classList.add("seleccionado");
}

/* ============================================================
   PERSONAS / m2 — TIEMPO REAL (FIX DEFINITIVO)
=========================================================== */

function actualizarCapacidad() {
  const m2 = parseFloat(document.getElementById("m2").value) || 0;
  document.getElementById("capacidadTexto").innerHTML =
    `<strong>Personas permitidas:</strong> ${Math.floor(m2 / 3.5)}`;
}

/* ============================================================
   RESULTADO COMPLETO (RESPUESTAS + MEJORAS)
=========================================================== */

function calcular() {
  const m2 = parseFloat(document.getElementById("m2").value) || 0;
  let html = `<p><strong>Superficie:</strong> ${m2} m²</p>`;

  Object.entries(bloques).forEach(([id, preguntas], idxBloque) => {
    html += `<h3>Bloque ${idxBloque + 2}</h3><ul>`;
    preguntas.forEach((p, i) => {
      const r = respuestas[`${id}_${i}`] || "—";
      html += `<li>${p.t} → <strong>${r.toUpperCase()}</strong>`;
      if (r === "no" && mapaMejoras[`${id}_${i}`]) {
        html += `<ul><li><em>${mapaMejoras[`${id}_${i}`][0]}</em></li></ul>`;
      }
      html += `</li>`;
    });
    html += `</ul>`;
  });

  html += `
    <h3>Observaciones</h3>
    <textarea id="comentarios" style="width:100%;min-height:100px;"></textarea>
  `;

  document.getElementById("resultado").innerHTML = html;
  nextStep();
}

/* ============================================================
   PDF (OBSERVACIONES INCLUIDAS)
=========================================================== */

function descargarPDF() {
  const res = document.getElementById("resultado").cloneNode(true);
  const t = res.querySelector("textarea");
  if (t) {
    const p = document.createElement("p");
    p.innerHTML = t.value || "Sin observaciones.";
    t.replaceWith(p);
  }
  const w = window.open("");
  w.document.write(`<html><body>${res.innerHTML}</body></html>`);
  w.document.close();
  w.print();
}

/* ============================================================
   INIT
=========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  generarFormularios();
  document.getElementById("m2").addEventListener("input", actualizarCapacidad);
});
