// static/js/main.js

import { sephirot } from './sephirot.js';

// 1) Lista completa de las sefirot (IDs en tu SVG)
const allIds = [
  'Keter','Chokmah','Binah',
  'Chesed','Geburah','Tiferet',
  'Netzach','Hod','Yesod','Malkuth'
];

// 2) Configuración de cada «circuito»
const circuits = [
  {
    selector: '.cls-20',
    ids: ['Netzach','Hod','Yesod','Tiferet','Malkuth'],
    color: '#FF0801',
    stroke: true
  },
  {
    selector: '.cls-21',
    ids: ['Hod','Tiferet','Chesed','Netzach','Geburah','Yesod'],
    color: '#024921',
    stroke: true
  },
  {
    selector: '.cls-22',
    ids: ['Tiferet','Chesed','Geburah','Chokmah','Binah','Keter'],
    color: '#003E99',
    stroke: true
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

// 8) Configuración de los circuitos según la tabla
function setupCircuits() {
  circuits.forEach(({ selector, ids, color, stroke }) => {
    const trigger = document.querySelector(selector);
    let isActive = false;

    trigger.addEventListener('click', () => {
      isActive = !isActive;
      resetAll();
      if (!isActive) return;

      // a) Bordes: trigger activo en su color, otros en blanco
      circuits.forEach(c => {
        const t = document.querySelector(c.selector);
        if (!t) return;
        if (c.selector === selector && stroke) {
          t.style.strokeWidth = '2';
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

      // d) Conectores (.cls-15) en rojo
      document.querySelectorAll('.cls-15').forEach(el => {
        el.style.stroke = '#dddddd';
      });
    });
  });
}
