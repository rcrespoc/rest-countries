import { d, $loader, ls } from './variables.js';

function mostrarSpinner(darkModeTheme, $elemento) {
  limpiarHTML($elemento);
  $loader.style = 'display: block;'
  if(darkModeTheme){
    $loader.innerHTML = `
    <div class="sk-circle">
      <div class="sk-circle1 sk-child-2"></div>
      <div class="sk-circle2 sk-child-2"></div>
      <div class="sk-circle3 sk-child-2"></div>
      <div class="sk-circle4 sk-child-2"></div>
      <div class="sk-circle5 sk-child-2"></div>
      <div class="sk-circle6 sk-child-2"></div>
      <div class="sk-circle7 sk-child-2"></div>
      <div class="sk-circle8 sk-child-2"></div>
      <div class="sk-circle9 sk-child-2"></div>
      <div class="sk-circle10 sk-child-2"></div>
      <div class="sk-circle11 sk-child-2"></div>
      <div class="sk-circle12 sk-child-2"></div>
    </div>
    `;
  }else{
    $loader.innerHTML = `
    <div class="sk-circle">
      <div class="sk-circle1 sk-child"></div>
      <div class="sk-circle2 sk-child"></div>
      <div class="sk-circle3 sk-child"></div>
      <div class="sk-circle4 sk-child"></div>
      <div class="sk-circle5 sk-child"></div>
      <div class="sk-circle6 sk-child"></div>
      <div class="sk-circle7 sk-child"></div>
      <div class="sk-circle8 sk-child"></div>
      <div class="sk-circle9 sk-child"></div>
      <div class="sk-circle10 sk-child"></div>
      <div class="sk-circle11 sk-child"></div>
      <div class="sk-circle12 sk-child"></div>
    </div>
    `;
  }
}

const limpiarHTML = ($elemento) => {
  while($elemento.firstChild){
    $elemento.removeChild($elemento.firstChild);
  }
}

function *crearPaginador(total) {
  for (let i = 1; i <= total; i++ ) {
      yield i;
  }
}

function activarModoOscuro(darkModeTheme) {
  if(!darkModeTheme){
    darkModeTheme = darkMode();
    ls.setItem('theme', 'dark')
  }else{
    darkModeTheme = lightMode();;
    ls.setItem('theme', 'light');
  }
  return darkModeTheme;
}
function lightMode() {
  const $selectores = d.querySelectorAll('[data-dark]');
  const $selectoresCard = d.querySelectorAll('[data-dark-card]');
  $selectores.forEach(el => el.classList.remove('dark-mode-class'))
  $selectoresCard.forEach(el => el.classList.remove('dark-mode-card'));
  return false;
}

function darkMode() {
  const $selectores = d.querySelectorAll('[data-dark]');
  const $selectoresCard = d.querySelectorAll('[data-dark-card]');
  $selectores.forEach(el => el.classList.add('dark-mode-class'))
  $selectoresCard.forEach(el => el.classList.add('dark-mode-card'))
  return true;
}

function mostrarError($elemento) {
  limpiarHTML($elemento);
  const $h3 = d.createElement('h3');
  $h3.classList.add('error', 'text-center', 'p-1', 'text-white-1');
  $h3.textContent = 'No fue posible encontrar países con dicho nombre.'
  $h3.style.gridColumn = 'span 4';
  $loader.style.display = 'none';
  $elemento.appendChild($h3);
}
export { mostrarSpinner, limpiarHTML, crearPaginador, activarModoOscuro, lightMode, darkMode, mostrarError };
