/* ============================================================
   APP.JS — ÁREAS CLIMATIZADAS CBA
=========================================================== */

let respuestas = {};
let datosGenerales = { medico: null };
let imagenesCargadas = [];

/* ============================================================
   DEFINICIÓN DE BLOQUES Y PREGUNTAS
=========================================================== */

const bloques = {

  /* BLOQUE 2 – CONFORT TÉRMICO */
  form2: [
    { t: "¿El recinto cuenta con temperatura estable?", d: "Temperatura agradable y homogénea.", g: "grave" },
    { t: "¿Hay circulación de aire natural (ventilación cruzada)?", d: "Ventanas o flujo cruzado.", g: "leve" },
    { t: "¿El espacio posee aire acondicionado en funcionamiento?", d: "AA operativo.", g: "medio" },
    { t: "¿Posee ventiladores funcionando?", d: "Ventiladores operativos.", g: "leve" }
  ],

  /* BLOQUE 3 – DISPOSICIONES EDILICIAS */
  form3: [
    { t: "¿La fachada principal está orientada al norte?", d: "Radiación controlable.", g: "medio" },
    { t: "¿La menor cantidad de aberturas se orientan al oeste?", d: "Menor carga térmica.", g: "medio" },
    { t: "¿El área permite acceso seguro PMR?", d: "Rampas, accesos, nivelación.", g: "grave" }
  ],

  /* BLOQUE 4 – ENVOLVENTE */
  form4: [
    { t: "¿El techo evita transferencia de calor?", d: "Aislación térmica.", g: "grave" },
    { t: "¿Posee planta superior?", d: "Reduce carga térmica.", g: "medio" }
  ],

  /* BLOQUE 5 – PROTECCIONES */
  form5: [
    { t: "¿Posee elementos de sombra?", d: "Toldos, cortinas.", g: "leve" },
    { t: "¿Sombreado al norte?", d: "Vegetación / edificios.", g: "medio" },
    { t: "¿Sombreado al oeste?", d: "Vegetación / edificios.", g: "medio" }
  ],

  /* BLOQUE 6 – DISEÑO */
  form6: [
    { t: "¿Aberturas altas para salida de aire caliente?", d: "Ventilación superior.", g: "leve" },
    { t: "¿Posee tela mosquitera?", d: "Condiciones sanitarias.", g: "leve" }
  ],

  /* BLOQUE 7 – SERVICIOS */
  form7: [
    {
      t: "¿El área cuenta con agua fría disponible para el público?",
      d: "Heladera, dispenser o botellón.",
      g: "muygrave"
    },
    { t: "¿Área de reposo o espera?", d: "Sillas o bancos.", g: "medio" },
    { t: "¿Preparada para energía solar futura?", d: "Espacio y estructura.", g: "medio" }
  ]
};

/* ============================================================
   FORMULARIOS
=========================================================== */

function generarFormularios() {
  Object.keys(bloques).forEach(b => {
    const cont = document.getElementById(b);
    bloques[b].forEach((p, i) => {
      const div = document.createElement("div");
      div.className = "pregunta";
      div.innerHTML = `
        <strong>${p.t}</strong>
        <p class="explica">${p.d}</p>
        <div class="opciones">
          <button class="btn-resp btn-si" onclick="seleccionarRespuesta('${b}',${i},'si',this)">Sí</button>
          <button class="btn-resp btn-no-${p.g}" onclick="seleccionarRespuesta('${b}',${i},'no',this)">No</button>
        </div>`;
      cont.appendChild(div);
    });
  });
}
generarFormularios();

/* ============================================================
   RESPUESTAS Y NAVEGACIÓN
=========================================================== */

function seleccionarRespuesta(b,i,v,btn){
  respuestas[`${b}_${i}`]=v;
  btn.parentElement.querySelectorAll(".btn-resp").forEach(x=>x.classList.remove("seleccionado"));
  btn.classList.add("seleccionado");
}

function setDatoGeneral(c,v,btn){
  datosGenerales[c]=v;
  btn.parentNode.querySelectorAll("button").forEach(x=>x.classList.remove("seleccionado"));
  btn.classList.add("seleccionado");
}

let pasoActual=1;
function mostrarPaso(n){
  document.querySelectorAll(".step").forEach(s=>s.classList.remove("active"));
  document.getElementById("step"+n).classList.add("active");
}
function nextStep(){pasoActual++;mostrarPaso(pasoActual);}
function prevStep(){pasoActual--;mostrarPaso(pasoActual);}

/* ============================================================
   CAPACIDAD
=========================================================== */

document.getElementById("m2").addEventListener("input",()=>{
  const m2=parseFloat(m2.value)||0;
  capacidadTexto.innerHTML=`<strong>Personas permitidas:</strong> ${Math.floor(m2/3.5)}`;
});

/* ============================================================
   GRAVEDADES Y CLASIFICACIÓN
=========================================================== */

function obtenerGravedadFinal(b,i,v){
  if(b==="form7"&&i===0) return v==="si"?"bueno":"muygrave";
  if(b==="form5") return v==="si"?"bueno":"leve";
  return v==="si"?"bueno":bloques[b][i].g;
}

function clasificarPunto(){
  let muy=0,gra=0,med=0,lev=0,buenas=0;
  Object.keys(respuestas).forEach(k=>{
    const[b,i]=k.split("_");
    const g=obtenerGravedadFinal(b,+i,respuestas[k]);
    if(g==="bueno")buenas++;
    if(g==="muygrave")muy++;
    if(g==="grave")gra++;
    if(g==="medio")med++;
    if(g==="leve")lev++;
  });

  if(respuestas["form7_0"]==="no"||buenas<4||muy>=1||gra>=4||med>=6||lev>=7)
    return{estado:"rojo",muy,gra,med,lev,buenas};

  if(gra>=2||med>=3||lev>=4)
    return{estado:"amarillo",muy,gra,med,lev,buenas};

  return{estado:"verde",muy,gra,med,lev,buenas};
}

/* ============================================================
   IMÁGENES
=========================================================== */

function manejarImagen(input){
  const file=input.files[0];
  if(!file)return;
  const r=new FileReader();
  r.onload=e=>{
    imagenesCargadas.push(e.target.result);
    mostrarImagenes();
  };
  r.readAsDataURL(file);
}

function mostrarImagenes(){
  const cont=document.getElementById("imagenesPreview");
  if(!cont)return;
  cont.innerHTML="";
  imagenesCargadas.forEach(src=>{
    const img=document.createElement("img");
    img.src=src;
    img.style.maxWidth="150px";
    img.style.margin="5px";
    cont.appendChild(img);
  });
}

/* ============================================================
   RESULTADOS
=========================================================== */

function cargarResultados(){
  calcular();
  mostrarPaso(8);
}

function calcular(){

  const {estado,muy,gra,med,lev,buenas}=clasificarPunto();
  const m2=parseFloat(m2.value)||0;
  const capacidad=Math.floor(m2/3.5);

  let html=`
  <h2>${estado==="rojo"?"🟥 Área NO apta":estado==="amarillo"?"🟡 Área con mejoras":"🟢 Área apta"}</h2>
  <p><strong>Área:</strong> ${m2} m²</p>
  <p><strong>Capacidad:</strong> ${capacidad} personas</p><hr>

  <h3>Resumen</h3>
  <ul>
    <li>Buenas: ${buenas}</li>
    <li>Leves: ${lev}</li>
    <li>Medias: ${med}</li>
    <li>Graves: ${gra}</li>
    <li>Muy graves: ${muy}</li>
  </ul><hr>

  <h3>Detalle por bloque</h3>
  `;

  Object.keys(bloques).forEach(b=>{
    html+=`<h4>${b}</h4>`;
    bloques[b].forEach((p,i)=>{
      const v=respuestas[`${b}_${i}`];
      const g=v?obtenerGravedadFinal(b,i,v):"—";
      html+=`<p><strong>${p.t}</strong><br>${v?`${v.toUpperCase()} — ${g.toUpperCase()}`:"Sin respuesta"}</p>`;
    });
    html+="<hr>";
  });

  html+=`
  <h3>Comentarios adicionales</h3>
  <textarea id="comentariosFinal" style="width:100%;height:120px;"></textarea>

  <h3>Registro fotográfico</h3>
  <div id="imagenesPreview"></div>
  `;

  resultado.innerHTML=html;
  mostrarImagenes();
}

/* ============================================================
   PDF
=========================================================== */

function descargarPDF(){
  const w=window.open("","_blank");
  w.document.write(`
  <html><head>
  <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>body{font-family:'Public Sans',sans-serif;padding:20px}</style>
  </head><body>${resultado.innerHTML}</body></html>`);
  w.document.close();
  w.print();
}

