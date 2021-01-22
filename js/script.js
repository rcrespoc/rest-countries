const d = document;
let url = `https://restcountries.eu/rest/v2/all`;
const $mainContent = d.querySelector('#main-content');
const $paginacionDiv = d.querySelector('#paginacion');
const $inputCountry = d.querySelector('#country');
const $selectCountries = d.querySelector('#countries');
const $loader = d.querySelector('.loader');
let numXPagina = 8;
if(window.matchMedia('(min-width: 80rem)').matches){
  numXPagina = 8;
}else if(window.matchMedia('(min-width: 64rem)').matches){
  numXPagina = 9;
}else {
  numXPagina = 8;
}
let totalPaginas;
let paginaActual = 1;
let inicio = 0;
let fin = inicio + numXPagina;
const $darkBtn = d.querySelector('.dark-mode-btn');
let darkModeTheme = false;
const ls = localStorage;

d.addEventListener('DOMContentLoaded', e => {
  if(ls.getItem('theme') === null) ls.setItem('theme', 'light');
  if(ls.getItem('theme') === 'light'){
    darkModeTheme = false;
    lightMode();
  };
  if(ls.getItem('theme') === 'dark'){
    darkModeTheme = true;
    darkMode();
  }
  cargarPaises(inicio, fin, url);
});

$darkBtn.addEventListener('click', activarModoOscuro);

$selectCountries.addEventListener('change', e => {
  url = `https://restcountries.eu/rest/v2/region/${e.target.value}`;
  inicio = 0;
  cargarPaises(inicio, fin, url);
})
$inputCountry.addEventListener('input', e => {
  if(e.target.value.match(/[a-zA-Z]/)){

    if(e.target.length === 0){
      url = `https://restcountries.eu/rest/v2/name/all`;
    }else{
      url = `https://restcountries.eu/rest/v2/name/${e.target.value}`;
    }
    inicio = 0;
    cargarPaises(inicio, fin, url);
  }
})

async function cargarPaises(inicio, fin, url) {
  mostrarSpinner();
  try {
    const response = await fetch(url);
    const data = await response.json();
    if(data.status === 404){
      totalPaginas = 1;
      mostrarError();
      limpiarPaginador();
      imprimirPaginador();
    }else{
      totalPaginas = Math.ceil(data.length / numXPagina);
      mostrarDatos(data.slice(inicio, fin));
    }
  } catch (error) {
    console.log(error);
  }
}

function mostrarError() {
  limpiarHTML();
  const $h3 = d.createElement('h3');
  $h3.classList.add('error', 'text-center', 'p-1', 'text-white-1');
  $h3.textContent = 'No fue posible encontrar países con dicho nombre.'
  $mainContent.appendChild($h3);
}

function mostrarDatos(data) {
  limpiarHTML();
  const $fragment = d.createDocumentFragment();
  data.forEach(pais => {
    const { name, population, region, capital } = pais;
    const $divCard = d.createElement('div');
    const $enlaceImg = d.createElement('a');
    const $imgCountry = d.createElement('img');
    const $sectionCountryInfo = d.createElement('section');
    
    $enlaceImg.dataset.pais = name;
    $enlaceImg.href = `detallePais.html?pais=${name}`;
    $divCard.classList.add('card', 'bg-white-1');
    $divCard.setAttribute('data-dark-card','');
    if(darkModeTheme) $divCard.classList.add('dark-mode-card');
    $sectionCountryInfo.classList.add('country-info', 'p-1-5');
    
    $sectionCountryInfo.innerHTML = `
    <h4 class="mb-1">${name}</h4>
    <small><strong>Population: </strong> ${Intl.NumberFormat('de-DE').format(population)}</small><br>
    <small><strong>Region: </strong> ${region}</small><br>
    <small><strong>Capital: </strong> ${capital}</small><br>
    `;
    
    $imgCountry.src = pais.flag;
    $imgCountry.alt = `Bandera de ${name}`;
    $enlaceImg.appendChild($imgCountry);
    $divCard.appendChild($enlaceImg);
    $divCard.appendChild($sectionCountryInfo);
    $fragment.appendChild($divCard);
  })
  $loader.style.display ='none'
  $mainContent.appendChild($fragment);
  limpiarPaginador();
  imprimirPaginador();

}
const limpiarPaginador = () => {
  while($paginacionDiv.firstChild) {
    $paginacionDiv.removeChild($paginacionDiv.firstChild)
  }
}
const limpiarHTML = () => {
  while($mainContent.firstChild){
    $mainContent.removeChild($mainContent.firstChild);
  }
}
function *crearPaginador(total) {
  for (let i = 1; i <= total; i++ ) {
      yield i;
  }
}
function imprimirPaginador() {
  iterador = crearPaginador(totalPaginas);
  const $fragment = d.createDocumentFragment();
  let fin = false;
  while(!fin) {
      const { value, done} = iterador.next();
      if(done){
        fin = true;
      }else{
        // Caso contrario, genera un botón por cada elemento en el generador
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('btn');
        boton.onclick = (e) => {
          paginaActual = value;
          inicio = (paginaActual - 1) * numXPagina;
          fin = inicio + numXPagina;
          limpiarHTML();
          mostrarSpinner();
          cargarPaises(inicio, fin, url);
        }
        $fragment.appendChild(boton);
      }
  }
  $paginacionDiv.appendChild($fragment);
}

function mostrarSpinner() {
  limpiarHTML();
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

function activarModoOscuro() {
  if(!darkModeTheme){
    darkModeTheme = true
    darkMode();
    ls.setItem('theme', 'dark')
  }else{
    darkModeTheme = false;
    lightMode();
    ls.setItem('theme', 'light');
  }
}
function lightMode() {
  const $selectores = d.querySelectorAll('[data-dark]');
  const $selectoresCard = d.querySelectorAll('[data-dark-card]');
  $selectores.forEach(el => el.classList.remove('dark-mode-class'))
  $selectoresCard.forEach(el => el.classList.remove('dark-mode-card'))
}

function darkMode() {
  const $selectores = d.querySelectorAll('[data-dark]');
  const $selectoresCard = d.querySelectorAll('[data-dark-card]');
  $selectores.forEach(el => el.classList.add('dark-mode-class'))
  $selectoresCard.forEach(el => el.classList.add('dark-mode-card'))
}