/* =========================================================
   Shopify Creators — interacciones
   ========================================================= */
const CONFIG = {
  // Número de WhatsApp con código de país, sin espacios ni "+". Ej: 5215512345678
  // PENDIENTE: mientras esté vacío, WhatsApp pedirá elegir el contacto.
  whatsapp: '',
  // Duración de la oferta en segundos (15:41). Se reinicia cada vez que alguien entra.
  offerSeconds: 15 * 60 + 41,
  // Lugares "disponibles hoy" que muestra la tarjeta de precio.
  spots: 4,
};

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ---------- WhatsApp ---------- */
function waMessage(source, extra) {
  let msg = 'Hola, Shopify Creators. Quiero crear mi sitio web con la promoción de $2,499 MXN (precio original $6,000) que incluye entrega en 24 horas, asesoría gratuita y el curso de Facebook Ads de regalo.';
  if (extra) msg += `\n\nMe gustó el proyecto: ${extra}.`;
  msg += '\n\n¿Me pueden dar más información?';
  return msg;
}
function waUrl(source, extra) {
  const text = encodeURIComponent(waMessage(source, extra));
  const num = String(CONFIG.whatsapp).replace(/\D/g, '');
  return num ? `https://wa.me/${num}?text=${text}` : `https://wa.me/?text=${text}`;
}
let currentWork = null;
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-wa]');
  if (!a) return;
  e.preventDefault();
  const extra = a.dataset.wa === 'preview' && currentWork ? currentWork.name : '';
  window.open(waUrl(a.dataset.wa, extra), '_blank', 'noopener');
});

/* ---------- Temporizador (se reinicia en cada visita) ---------- */
(function timer() {
  const total = CONFIG.offerSeconds;
  let end = Date.now() + total * 1000;
  const els = $$('[data-timer]');
  const min = $('[data-timer-min]');
  const sec = $('[data-timer-sec]');
  const bar = $('[data-timer-bar]');
  const pad = (n) => String(n).padStart(2, '0');
  function tick() {
    let left = Math.round((end - Date.now()) / 1000);
    if (left <= 0) { end = Date.now() + total * 1000; left = total; }
    const m = pad(Math.floor(left / 60));
    const s = pad(left % 60);
    els.forEach((el) => { el.textContent = `${m}:${s}`; });
    if (min) min.textContent = m;
    if (sec) sec.textContent = s;
    if (bar) bar.style.width = `${(left / total) * 100}%`;
  }
  tick();
  setInterval(tick, 1000);
})();

/* ---------- Header, menú, sticky CTA ---------- */
const header = $('#header');
const sticky = $('#stickyCta');
const heroActions = $('.hero__actions');
function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('is-scrolled', y > 10);
  const heroBottom = heroActions.getBoundingClientRect().bottom;
  sticky.classList.toggle('is-visible', heroBottom < 0);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const burger = $('#burger');
const nav = $('#nav');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', open);
});
$$('a', nav).forEach((a) => a.addEventListener('click', () => {
  nav.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
}));

/* ---------- Animaciones al hacer scroll ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add('is-in');
    io.unobserve(en.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
function observeReveals(root = document) {
  $$('.reveal:not(.is-in)', root).forEach((el) => {
    // escalonar elementos hermanos
    const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    const i = sibs.indexOf(el);
    if (i > 0 && !el.style.getPropertyValue('--d')) el.style.setProperty('--d', `${Math.min(i, 8) * 0.08}s`);
    io.observe(el);
  });
}

/* ---------- Contadores ---------- */
const countIO = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target;
    const to = +el.dataset.count;
    const t0 = performance.now();
    const dur = 1600;
    (function step(t) {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
    countIO.unobserve(el);
  });
}, { threshold: 0.5 });
$$('[data-count]').forEach((el) => countIO.observe(el));

/* ---------- Ventas en el mockup ---------- */
(function sales() {
  const el = $('[data-sales]');
  if (!el) return;
  let v = 14850;
  setInterval(() => {
    v += [350, 590, 1200, 799, 450][Math.floor(Math.random() * 5)];
    el.textContent = '$' + v.toLocaleString('en-US');
  }, 4200);
})();

/* ---------- Portafolio ---------- */
const WORKS = [
  { id: 'voltex-store', name: 'TechStore', cat: 'tech', label: 'Tecnología', url: 'techstore.mx',
    desc: 'Tienda de electrónica con celulares, consolas y periféricos. Variantes por color, capacidad y estado, y pedidos directos por WhatsApp.',
    tags: ['Variantes de producto', 'Checkout por WhatsApp', 'Filtros por categoría'] },
  { id: 'glow-beauty-mx', name: 'Glow & Beauty', cat: 'belleza', label: 'Belleza', url: 'glowbeauty.mx',
    desc: 'Boutique de maquillaje y skincare de lujo con estética editorial, colecciones por categoría y meses sin intereses.',
    tags: ['Diseño editorial', 'Colecciones', 'Ofertas destacadas'] },
  { id: 'highdrip', name: 'HIGHDRIP', cat: 'moda', label: 'Tenis', url: 'highdrip.mx',
    desc: 'Tenis de diseñador con estética urbana, verificación de autenticidad y reseñas de clientes.',
    tags: ['Estilo streetwear', 'Reseñas', 'Animaciones'] },
  { id: 'the-sneaker-vault', name: 'The Sneaker Vault', cat: 'moda', label: 'Sneakers', url: 'thesneakervault.mx',
    desc: 'Bóveda de tenis exóticos con autenticación en 12 puntos, envíos express y pagos a meses.',
    tags: ['Catálogo premium', 'Pagos a meses', 'Envío express'] },
  { id: 'narevo', name: 'NAREVO', cat: 'moda', label: 'Moda', url: 'narevo.mx',
    desc: 'Tenis y ropa de diseñador con identidad dorada, temporadas y catálogo completo con checkout de Shopify.',
    tags: ['Identidad de marca', 'Checkout Shopify', 'Temporadas'], noMobile: true },
  { id: 'somnia', name: 'Somnia', cat: 'nicho', label: 'Producto único', url: 'somnia.mx',
    desc: 'Página de producto único enfocada en conversión: ofertas por cantidad, regalo incluido, reseñas y contador de oferta.',
    tags: ['Producto ganador', 'Ofertas por volumen', 'Alta conversión'] },
  { id: 'neon-cards', name: 'NeonCards', cat: 'nicho', label: 'Coleccionables', url: 'neoncards.mx',
    desc: 'Tienda de cartas coleccionables TCG con preventas, productos sellados y efectos holográficos.',
    tags: ['Preventas', 'Efectos visuales', 'Checkout en 1 clic'], noMobile: true },
  { id: 'reventix', name: 'JustTickets', cat: 'nicho', label: 'Boletos', url: 'justtickets.mx',
    desc: 'Marketplace de reventa de boletos para conciertos, lucha libre y eventos con búsqueda por ciudad.',
    tags: ['Marketplace', 'Buscador', 'Venta por WhatsApp'] },
];

const grid = $('#portfolio');
grid.innerHTML = WORKS.map((w, i) => `
  <article class="work reveal" data-cat="${w.cat}" data-i="${i}" tabindex="0" role="button" aria-label="Vista previa de ${w.name}">
    <div class="browser">
      <div class="browser__bar"><i></i><i></i><i></i><span>${w.url}</span></div>
      <div class="browser__view">
        <img src="img/portfolio/${w.id}.jpg" alt="Página de inicio de ${w.name}" loading="lazy" width="1280" height="800">
        <div class="work__overlay"><span><svg class="ico"><use href="#i-eye"/></svg>Vista previa</span></div>
      </div>
    </div>
    <div class="work__meta"><div><h3>${w.name}</h3><p>${w.desc.split('.')[0]}.</p></div><span class="work__tag">${w.label}</span></div>
  </article>`).join('');

$$('.chip').forEach((chip) => chip.addEventListener('click', () => {
  $$('.chip').forEach((c) => c.classList.toggle('is-active', c === chip));
  const f = chip.dataset.filter;
  $$('.work').forEach((w) => w.classList.toggle('is-hidden', f !== 'all' && w.dataset.cat !== f));
}));

/* ---------- Modales ---------- */
let lastFocus = null;
function openModal(m) {
  lastFocus = document.activeElement;
  m.classList.add('is-open');
  m.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('.modal__close', m)?.focus(), 50);
}
function closeModal(m) {
  m.classList.remove('is-open');
  m.setAttribute('aria-hidden', 'true');
  if (!$('.modal.is-open')) document.body.style.overflow = '';
  lastFocus?.focus?.();
}
$$('.modal').forEach((m) => m.addEventListener('click', (e) => {
  if (e.target.closest('[data-close]')) closeModal(m);
}));
document.addEventListener('keydown', (e) => {
  const open = $('.modal.is-open');
  if (!open) return;
  if (e.key === 'Escape') closeModal(open);
  if (open.id === 'previewModal' && e.key === 'ArrowRight') showWork(curIndex + 1);
  if (open.id === 'previewModal' && e.key === 'ArrowLeft') showWork(curIndex - 1);
});

/* Vista previa */
const pvModal = $('#previewModal');
const pv = $('.pv', pvModal);
let curIndex = 0;
function visibleWorks() {
  return $$('.work:not(.is-hidden)').map((el) => +el.dataset.i);
}
function showWork(i, instant) {
  const list = visibleWorks();
  let pos = list.indexOf(curIndex);
  if (instant) pos = list.indexOf(i);
  else pos = (list.indexOf(curIndex) + (i > curIndex ? 1 : -1) + list.length) % list.length;
  curIndex = list[pos] ?? i;
  const w = WORKS[curIndex];
  currentWork = w;
  const fill = () => {
    $('[data-pv-desk]', pv).src = `img/portfolio/${w.id}.jpg`;
    $('[data-pv-desk]', pv).alt = `Vista de escritorio de ${w.name}`;
    const phone = $('[data-pv-phone]', pv);
    phone.hidden = !!w.noMobile;
    if (!w.noMobile) {
      $('[data-pv-mob]', pv).src = `img/portfolio/${w.id}-m.jpg`;
      $('[data-pv-mob]', pv).alt = `Vista en celular de ${w.name}`;
    }
    $('[data-pv-url]', pv).textContent = w.url;
    $('[data-pv-cat]', pv).textContent = w.label;
    $('[data-pv-title]', pv).textContent = w.name;
    $('[data-pv-desc]', pv).textContent = w.desc;
    $('[data-pv-tags]', pv).innerHTML = w.tags.map((t) => `<li><svg class="ico"><use href="#i-check"/></svg>${t}</li>`).join('');
    pv.classList.remove('is-swapping');
  };
  if (instant) fill();
  else { pv.classList.add('is-swapping'); setTimeout(fill, 220); }
}
grid.addEventListener('click', (e) => {
  const card = e.target.closest('.work');
  if (!card) return;
  curIndex = +card.dataset.i;
  showWork(curIndex, true);
  openModal(pvModal);
});
grid.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('work')) {
    e.preventDefault();
    e.target.click();
  }
});
$('[data-pv-next]', pv).addEventListener('click', () => showWork(curIndex + 1));
$('[data-pv-prev]', pv).addEventListener('click', () => showWork(curIndex - 1));

/* ---------- Políticas ---------- */
const UPDATED = 'Última actualización: octubre de 2026';
const POLICIES = {
  terminos: `
    <h2 id="policyTitle">Términos y condiciones</h2><p class="doc__date">${UPDATED}</p>
    <p>Estos términos regulan la contratación de los servicios de diseño y configuración de tiendas en línea que ofrece <strong>Shopify Creators</strong> (en adelante, "la Agencia"). Al solicitar un servicio, el cliente acepta estos términos.</p>
    <h3>1. Servicio</h3>
    <p>La Agencia diseña, configura y entrega una tienda en línea sobre la plataforma Shopify. El paquete promocional incluye: diseño personalizado, adaptación a celular, carga de hasta 20 productos con variantes, configuración de métodos de pago y envío, políticas legales de la tienda, SEO básico, conexión de dominio, capacitación de uso, asesoría gratuita y acceso al curso de Facebook Ads.</p>
    <h3>2. Precio y pago</h3>
    <ul>
      <li>El precio promocional es de <strong>$2,499 MXN</strong> en un solo pago. El precio regular del servicio es de $6,000 MXN.</li>
      <li>El precio de promoción se respeta al cliente que aparta su lugar durante la vigencia de la oferta.</li>
      <li>Los pagos se realizan por transferencia bancaria o tarjeta, con los datos que la Agencia comparte por WhatsApp.</li>
    </ul>
    <h3>3. Costos de terceros</h3>
    <p>La suscripción mensual a Shopify, el dominio, aplicaciones de pago de terceros, comisiones de pasarelas de pago y campañas publicitarias no están incluidos en el precio y se contratan a nombre del cliente. La tienda, sus datos y su contenido son propiedad del cliente.</p>
    <h3>4. Entrega</h3>
    <p>El plazo de entrega de 24 horas inicia una vez confirmado el pago y recibida la información completa del cliente (logo, fotos, precios, descripciones y accesos necesarios). Consulta la Política de entrega para más detalles.</p>
    <h3>5. Revisiones y soporte</h3>
    <p>Antes de la entrega final el cliente puede solicitar ajustes de diseño sobre el proyecto acordado. Después de la entrega, el cliente cuenta con 7 días naturales de soporte para dudas y ajustes menores. Cambios mayores o nuevas funciones se cotizan por separado.</p>
    <h3>6. Responsabilidades del cliente</h3>
    <ul>
      <li>Proporcionar información veraz y contenido sobre el que tenga derechos de uso.</li>
      <li>Cumplir con las políticas de Shopify y la legislación aplicable a los productos que vende.</li>
      <li>Resguardar sus contraseñas y accesos una vez entregada la tienda.</li>
    </ul>
    <h3>7. Resultados</h3>
    <p>La Agencia entrega una tienda funcional y profesional, pero no garantiza un volumen específico de ventas, ya que estas dependen del producto, el precio, la publicidad y la gestión del cliente. Las cifras mostradas en imágenes de ejemplo son ilustrativas.</p>
    <h3>8. Propiedad intelectual</h3>
    <p>Al liquidar el servicio, el diseño entregado pertenece al cliente. La Agencia podrá mostrar el proyecto en su portafolio, salvo que el cliente solicite lo contrario por escrito.</p>
    <h3>9. Marcas</h3>
    <p>Shopify es una marca registrada de Shopify Inc. Shopify Creators es una agencia independiente y no está afiliada, patrocinada ni respaldada por Shopify Inc.</p>
    <h3>10. Legislación aplicable</h3>
    <p>Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier controversia se resolverá ante los tribunales competentes, sin perjuicio de los derechos del consumidor ante la PROFECO.</p>`,
  privacidad: `
    <h2 id="policyTitle">Aviso de privacidad</h2><p class="doc__date">${UPDATED}</p>
    <p>En cumplimiento de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, <strong>Shopify Creators</strong> informa cómo trata los datos personales de sus clientes y prospectos.</p>
    <h3>Datos que recabamos</h3>
    <ul>
      <li>Nombre, número de teléfono, correo electrónico y ciudad.</li>
      <li>Información de tu negocio: nombre comercial, logotipo, productos, precios y fotografías.</li>
      <li>Datos necesarios para facturación, en caso de solicitarla.</li>
    </ul>
    <p>No solicitamos ni almacenamos datos de tarjetas bancarias; los pagos con tarjeta se procesan mediante proveedores de pago externos.</p>
    <h3>Finalidades</h3>
    <ul>
      <li>Dar seguimiento a tu solicitud y brindarte la asesoría gratuita.</li>
      <li>Diseñar, configurar y entregar tu tienda en línea.</li>
      <li>Enviarte el acceso al curso de Facebook Ads y brindarte soporte.</li>
      <li>De forma secundaria, enviarte promociones de nuestros servicios. Puedes negarte en cualquier momento.</li>
    </ul>
    <h3>Transferencias</h3>
    <p>Tus datos solo se comparten con los proveedores necesarios para prestar el servicio (por ejemplo, la plataforma de comercio electrónico o el proveedor de pagos) y con autoridades cuando la ley lo requiera.</p>
    <h3>Derechos ARCO</h3>
    <p>Puedes solicitar el Acceso, Rectificación, Cancelación u Oposición al uso de tus datos, así como revocar tu consentimiento, enviando tu solicitud por WhatsApp o al correo de contacto de la Agencia. Responderemos en un plazo máximo de 20 días hábiles.</p>
    <h3>Cookies</h3>
    <p>Este sitio puede utilizar cookies y herramientas de medición para mejorar la experiencia y medir campañas publicitarias. Puedes desactivarlas desde la configuración de tu navegador.</p>
    <h3>Cambios</h3>
    <p>Cualquier cambio a este aviso se publicará en esta misma página.</p>`,
  reembolsos: `
    <h2 id="policyTitle">Política de reembolsos</h2><p class="doc__date">${UPDATED}</p>
    <p>Queremos que estés contento con tu tienda. Por eso trabajamos con revisiones antes de la entrega final.</p>
    <h3>Antes de iniciar el proyecto</h3>
    <p>Si cancelas antes de que comencemos a trabajar en tu tienda, te reembolsamos el 100% de tu pago.</p>
    <h3>Con el proyecto en proceso</h3>
    <p>Si el diseño ya está en desarrollo, primero te ofrecemos ajustes para que el resultado sea el que esperas. Si aun así decides cancelar antes de la entrega final, se reembolsará el 50% del pago, correspondiente al trabajo no realizado.</p>
    <h3>Después de la entrega</h3>
    <p>Una vez entregada y aprobada la tienda, el servicio se considera prestado y no aplican reembolsos. Mantienes tus 7 días de soporte para ajustes menores.</p>
    <h3>Bonos</h3>
    <p>El curso de Facebook Ads es un regalo ligado a la contratación del servicio, no tiene valor canjeable en efectivo.</p>
    <h3>Costos de terceros</h3>
    <p>Los pagos realizados directamente a Shopify, proveedores de dominio o aplicaciones se rigen por las políticas de cada proveedor.</p>
    <h3>Cómo solicitarlo</h3>
    <p>Escríbenos por WhatsApp indicando tu nombre y fecha de pago. Los reembolsos aprobados se realizan por el mismo medio de pago en un plazo de 5 a 10 días hábiles.</p>`,
  entrega: `
    <h2 id="policyTitle">Política de entrega</h2><p class="doc__date">${UPDATED}</p>
    <h3>Plazo de 24 horas</h3>
    <p>Entregamos tu tienda en un máximo de 24 horas contadas a partir de que se cumplan estas dos condiciones:</p>
    <ul>
      <li>Pago confirmado.</li>
      <li>Recepción de tu información completa: logo, fotos, nombres, precios y descripciones de productos, datos de contacto y accesos necesarios.</li>
    </ul>
    <p>Si la información llega incompleta, el plazo inicia cuando la recibamos completa. Durante la asesoría gratuita te ayudamos a reunir todo.</p>
    <h3>Forma de entrega</h3>
    <p>Te compartimos el enlace de tu tienda y los accesos de administrador. Hacemos una videollamada o enviamos un video de capacitación para que aprendas a administrarla.</p>
    <h3>Revisiones</h3>
    <p>Antes de publicar, revisas tu tienda y nos indicas los ajustes. Los ajustes sobre el diseño acordado están incluidos.</p>
    <h3>Horario</h3>
    <p>Atendemos de lunes a sábado de 9:00 a 21:00 h (hora del centro de México). Las solicitudes recibidas en domingo o día festivo comienzan a contar el siguiente día hábil.</p>
    <h3>Curso de Facebook Ads</h3>
    <p>El acceso al curso se envía junto con la entrega de tu tienda por WhatsApp o correo electrónico.</p>`,
};
const policyModal = $('#policyModal');
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-policy]');
  if (!a) return;
  e.preventDefault();
  $('#policyBody').innerHTML = POLICIES[a.dataset.policy] || '';
  $('.modal__panel', policyModal).scrollTop = 0;
  openModal(policyModal);
});

/* ---------- Notificaciones de actividad ---------- */
(function toasts() {
  const toast = $('#toast');
  const title = $('[data-toast-title]', toast);
  const sub = $('[data-toast-sub]', toast);
  const names = ['Fernanda', 'Luis', 'Paola', 'Ricardo', 'Daniela', 'Alejandro', 'Sofía', 'Miguel', 'Valeria', 'Óscar'];
  const cities = ['Guadalajara', 'CDMX', 'Monterrey', 'Puebla', 'Querétaro', 'Tijuana', 'León', 'Mérida', 'Toluca', 'Cancún'];
  const actions = ['solicitó su sitio web', 'apartó su lugar en la promoción', 'recibió su tienda en 24 h'];
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  function show() {
    if ($('.modal.is-open')) return;
    title.textContent = `${pick(names)} de ${pick(cities)} ${pick(actions)}`;
    sub.textContent = `Hace ${2 + Math.floor(Math.random() * 25)} minutos`;
    toast.classList.add('is-visible');
    setTimeout(() => toast.classList.remove('is-visible'), 5000);
  }
  setTimeout(() => { show(); setInterval(show, 22000); }, 9000);
})();

/* ---------- Reseñas en movimiento (se duplican para un bucle continuo) ---------- */
$$('.reviews-row').forEach((row) => {
  const track = document.createElement('div');
  track.className = 'reviews-track';
  const items = [...row.children];
  items.forEach((el) => track.appendChild(el));
  // 4 copias: la mitad del carril siempre cubre pantallas anchas
  for (let i = 0; i < 3; i++) {
    items.forEach((el) => {
      const copy = el.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      track.appendChild(copy);
    });
  }
  row.appendChild(track);
});

/* ---------- Lugares disponibles ---------- */
(function spots() {
  const el = $('[data-spots]');
  if (!el) return;
  el.textContent = CONFIG.spots;
})();

/* ---------- Ventana de salida (una vez por sesión) ---------- */
(function exitIntent() {
  const modal = $('#exitModal');
  let shown = false;
  try { shown = sessionStorage.getItem('sc_exit') === '1'; } catch (e) { /* sin storage */ }
  function trigger() {
    if (shown || $('.modal.is-open')) return;
    shown = true;
    try { sessionStorage.setItem('sc_exit', '1'); } catch (e) { /* sin storage */ }
    openModal(modal);
  }
  document.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget && e.clientY <= 0) trigger();
  });
  // En celular no existe "salir con el mouse": se muestra tras 45 s
  if (matchMedia('(pointer: coarse)').matches) setTimeout(trigger, 45000);
})();

$('[data-year]').textContent = new Date().getFullYear();
observeReveals();
