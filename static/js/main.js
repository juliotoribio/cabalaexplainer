// static/js/main.js

import { sephirot } from './sephirot.js';

// 1) Lista completa de las sefirot (IDs en tu SVG)
const allIds = [
  'Keter','Chokmah','Binah',
  'Chesed','Geburah','Tiferet',
  'Netzach','Hod','Yesod','Malkuth'
];

// 2) Configuración de cada «circuito» con su label
const circuits = [
  {
    selector: '.cls-20',
    ids: ['Netzach','Hod','Yesod','Tiferet','Malkuth'],
    color: '#FF0801',
    stroke: true,
    label: 'Inconsciente'
  },
  {
    selector: '.cls-21',
    ids: ['Hod','Tiferet','Chesed','Netzach','Geburah','Yesod'],
    color: '#024921',
    stroke: true,
    label: 'Consciente'
  },
  {
    selector: '.cls-22',
    ids: ['Tiferet','Chesed','Geburah','Chokmah','Binah','Keter'],
    color: '#003E99',
    stroke: true,
    label: 'Supraconsciente'
  }
];

// 3) Exportamos resetAll para uso externo (reset.js)
export function resetAll() {
  // a) Reset bordes de triggers
  circuits.forEach(cfg => {
    const t = document.querySelector(cfg.selector);
    if (t) {
      t.style.strokeWidth = '';
      t.style.stroke = '';
    }
  });

  // b) Reset relleno de círculos y Malkuth
  allIds.forEach(id => {
    if (id === 'Malkuth') {
      const g = document.getElementById('Malkuth');
      if (g) g.querySelectorAll('path').forEach(p => p.style.fill = '');
    } else {
      const c = document.getElementById(id);
      if (c) c.style.fill = '';
    }
  });

  // c) Reset textos de sephirot
  document.querySelectorAll('text.sephirah-text, text.sephirah-text-2')
    .forEach(txt => {
      txt.style.fill = '';
      txt.querySelectorAll('tspan').forEach(tp => tp.style.fill = '');
    });

  // d) Reset conectores (.cls-15 stroke)
  document.querySelectorAll('.cls-15').forEach(el => {
    el.style.stroke = '';
  });

  // e) Borrar label de circuito si existe
  const svg = document.querySelector('#svg-container svg');
  const oldLabel = svg && svg.querySelector('.circuit-label-text');
  if (oldLabel) svg.removeChild(oldLabel);
}

// 4) Función para cerrar modal (global para onclick)
function closeModal() {
  const modal = document.getElementById('modal');
  const backdrop = document.getElementById('backdrop');
  modal.style.display = 'none';
  backdrop.style.display = 'none';
}
window.closeModal = closeModal;

// 5) Inyección del SVG y arranque de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  fetch('/static/svg/arbol.svg')
    .then(res => res.text())
    .then(svgText => {
      document.getElementById('svg-container').innerHTML = svgText;
      initApp();
    })
    .catch(err => console.error('Error al cargar SVG:', err));
});

// 6) Inicialización general
function initApp() {
  setupModal();
  setupCircuits();
}

// 7) Configuración del modal de info
function setupModal() {
  document.querySelectorAll('.sephirah').forEach(c => {
    c.addEventListener('click', () => {
      const id = c.dataset.id;
      document.getElementById('modal-title').innerText = id;
      document.getElementById('modal-description').innerText = sephirot[id];
      document.getElementById('modal').style.display = 'block';
      document.getElementById('backdrop').style.display = 'block';
    });
  });
}

// 8) Configuración de los circuitos según la tabla, mostrando el label en el centro del círculo
function setupCircuits() {
  const svg = document.querySelector('#svg-container svg');

  circuits.forEach(({ selector, ids, color, stroke, label }) => {
    const trigger = document.querySelector(selector);
    let isActive = false;

    if (!trigger) return;
    trigger.addEventListener('click', () => {
      isActive = !isActive;
      resetAll();
      if (!isActive) return;

      // a) Bordes: trigger activo en su color, otros en blanco
      circuits.forEach(c => {
        const t = document.querySelector(c.selector);
        if (!t) return;
        if (c.selector === selector && stroke) {
          t.style.strokeWidth = '1.1';
          t.style.stroke = color;
        } else {
          t.style.stroke = 'white';
        }
      });

      // b) Relleno de círculos: activos en color, inactivos en gris
      const activeSet = new Set(ids);
      allIds.forEach(id => {
        const fill = activeSet.has(id) ? color : '#333';
        if (id === 'Malkuth') {
          const g = document.getElementById('Malkuth');
          if (g) g.querySelectorAll('path').forEach(p => p.style.fill = fill);
        } else {
          const c = document.getElementById(id);
          if (c) c.style.fill = fill;
        }
      });

      // c) Textos todos en blanco
      document.querySelectorAll('text.sephirah-text, text.sephirah-text-2')
        .forEach(txt => {
          txt.style.fill = 'white';
          txt.querySelectorAll('tspan').forEach(tp => tp.style.fill = 'white');
        });

      // d) Conectores (.cls-15) en gris claro
      document.querySelectorAll('.cls-15').forEach(el => {
        el.style.stroke = '#dddddd';
      });

      // e) Añadir el label dentro del SVG en el centro del círculo
      const cx = trigger.getAttribute('cx');
      const cy = trigger.getAttribute('cy');
      const offsetY = 55; // mueve el texto 15 unidades hacia arriba
      const yPos = parseFloat(cy) - offsetY;
      
      const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textEl.setAttribute('x', cx);
      textEl.setAttribute('y', yPos);
      textEl.setAttribute('class', 'circuit-label-text');
      textEl.setAttribute('text-anchor', 'middle');
      textEl.setAttribute('alignment-baseline', 'middle');
      textEl.setAttribute('fill', color);
      textEl.setAttribute('font-size', '1rem');
      // → Aquí añadimos Gilroy como font-family:
      textEl.setAttribute('font-family', 'Gilroy, sans-serif');
      textEl.style.pointerEvents = 'none';
      textEl.textContent = label;
      svg.appendChild(textEl);
    });
  });
}
