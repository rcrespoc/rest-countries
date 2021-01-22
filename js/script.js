import { mostrarSpinner, limpiarHTML, lightMode, darkMode, activarModoOscuro, crearPaginador, mostrarError } from './funciones.js';
import { d, ls, $darkBtn, $loader, $mainContent, $paginacionDiv, $inputCountry, $selectCountries } from './variables.js';

let url = `https://restcountries.eu/rest/v2/all`;
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
let darkModeTheme = false;

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

$darkBtn.addEventListener('click', cambioModo);

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
  mostrarSpinner(darkModeTheme, $mainContent);
  try {
    const response = await fetch(url);
    const data = await response.json();
    if(data.status === 404){
      totalPaginas = 1;
      mostrarError($mainContent);
      limpiarHTML($paginacionDiv);
      imprimirPaginador();
    }else{
      totalPaginas = Math.ceil(data.length / numXPagina);
      mostrarDatos(data.slice(inicio, fin));
    }
  } catch (error) {
    console.log(error);
  }
}

function mostrarDatos(data) {
  limpiarHTML($mainContent);
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
  limpiarHTML($paginacionDiv);
  imprimirPaginador();

}

function imprimirPaginador() {
  let iterador = crearPaginador(totalPaginas);
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
          limpiarHTML($mainContent);
          mostrarSpinner(darkModeTheme, $mainContent);
          cargarPaises(inicio, fin, url);
        }
        $fragment.appendChild(boton);
      }
  }
  $paginacionDiv.appendChild($fragment);
}
function cambioModo() {
  darkModeTheme = activarModoOscuro(darkModeTheme);
}
