import { mostrarSpinner, limpiarHTML, lightMode, darkMode, activarModoOscuro } from './funciones.js';
import { d, ls, $darkBtn, $loader, $detailCountry, searchParagram } from './variables.js';

let darkModeTheme = false;

d.addEventListener('DOMContentLoaded', async e => {
  if(ls.getItem('theme') === null) ls.setItem('theme', 'light');
  if(ls.getItem('theme') === 'light') darkModeTheme = lightMode();
  if(ls.getItem('theme') === 'dark') darkModeTheme = darkMode();
  let pais = searchParagram.get('pais');
  const url = `https://restcountries.eu/rest/v2/name/${pais}?fullText=true`;
  const dataPais = await buscarPais(url);
  dibujarHTML(...dataPais);
})

$darkBtn.addEventListener('click', cambioModo);

async function buscarPais(url) {
  mostrarSpinner(darkModeTheme, $detailCountry);
  try{
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function dibujarHTML(pais) {
  limpiarHTML($detailCountry);
  const { flag, name, nativeName, population, region, subregion, capital, topLevelDomain, currencies, languages, borders} = pais;
  let $tld = topLevelDomain.reduce((a, b) => a+', '+b);
  let $currencies = '';
  let $languages = '';
  currencies.forEach(el => $currencies+=', '+el.name);
  languages.forEach(el => $languages+=', '+el.name)
  $languages = $languages.slice(2)+'.';
  $currencies = $currencies.slice(2)+'.';


  // CREACION DE ELEMENTOS
  const $fragment = d.createDocumentFragment();
  const $imgPais = d.createElement('img');
  const $sectionDetail = d.createElement('section');
  const $h1Title = d.createElement('h1');
  const $divInfo1 = d.createElement('div');
  const $divInfo2 = d.createElement('div');
  const $sectionBorder = d.createElement('section');
  const $h2Title = d.createElement('h2');
  const $divBorder = d.createElement('div');


  // AGREGAR CLASES
  $sectionDetail.classList.add('detail-info');
  $h1Title.classList.add('mt-1');
  $divInfo1.classList.add('info', 'mt-2', 'mt-lg-0');
  $divInfo2.classList.add('info-2', 'mt-2', 'mt-lg-0');
  $sectionBorder.classList.add('border-countries');
  $sectionBorder.setAttribute('data-dark','');
  $h2Title.classList.add('mt-2', 'mt-lg-0');
  $divBorder.classList.add('border-countries-btn', 'flex', 'mt-1', 'mt-lg-0');

  // AGREGAR DATOS
  $imgPais.src = flag;
  $imgPais.alt = `Bandera de ${name}`;
  $h1Title.textContent = name;
  $divInfo1.innerHTML = `
    <p class="py-0-5"><strong>Native Name: </strong>${nativeName}</p>
    <p class="py-0-5"><strong>Population: </strong>${Intl.NumberFormat('de-DE').format(population)}</p>
    <p class="py-0-5"><strong>Region: </strong>${region}</p>
    <p class="py-0-5"><strong>Sub Region: </strong>${subregion}</p>
    <p class="py-0-5"><strong>Capital: </strong>${capital}</p>
  `;
  $divInfo2.innerHTML = `
    <p class="py-0-5"><strong>Top Level Domain: </strong>${$tld}</p>
    <p class="py-0-5"><strong>Currencies: </strong>${$currencies}</p>
    <p class="py-0-5"><strong>Languages: </strong>${$languages}</p>
  `;
  $h2Title.textContent = 'Border Countries'
  let $borders = await buscarNombres(borders);
  $borders.forEach( el => {
    const a = d.createElement('a');
    a.href=`#`;
    a.textContent = el;
    a.classList.add('w-30', 'mr-0-5', 'text-center', 'mt-1', 'px-lg-1');
    if(darkModeTheme) a.classList.add('dark-mode-card');
    a.setAttribute('data-dark-card','')
    a.onclick = async () => {
      const url = `https://restcountries.eu/rest/v2/name/${el}?fullText=true`;
      const dataPais = await buscarPais(url);
      dibujarHTML(...dataPais);
    }
    $divBorder.appendChild(a);
  });

  // AGREGAR A SUS PADRES
  $sectionDetail.appendChild($h1Title);
  $sectionDetail.appendChild($divInfo1);
  $sectionDetail.appendChild($divInfo2);
  $sectionBorder.appendChild($h2Title);
  $sectionBorder.appendChild($divBorder);
  $sectionDetail.appendChild($sectionBorder);

  // AGREGAR AL FRAGMENT
  $fragment.appendChild($imgPais);
  $fragment.appendChild($sectionDetail);

  // AGREGAR AL DOM
  $loader.style.display = 'none';
  $detailCountry.appendChild($fragment);
}

async function buscarNombres(data) {
  const borders = [];
  let url2 = `https://restcountries.eu/rest/v2/alpha?codes=`;
  data.forEach( el => url2+=el+';');
  try {
    const response = await fetch(url2);
    const datos = await response.json();
    datos.forEach(el => borders.push(el.name));
  } catch (error) {
    
  }
  return borders;
}
function cambioModo() {
  darkModeTheme = activarModoOscuro(darkModeTheme);
}