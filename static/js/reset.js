// static/js/reset.js

/**
 * Script de reinicio global:
 * Restablece la vista original de las sephirot al hacer clic
 * fuera de los triggers o de cualquier elemento .sephirah.
 */
import { resetAll } from './main.js';

document.addEventListener('click', (e) => {
  // Si el clic no proviene de un trigger ni de las sephirah, reseteamos
  if (!e.target.closest('.cls-20, .cls-21, .cls-22, .sephirah')) {
    resetAll();
  }
});