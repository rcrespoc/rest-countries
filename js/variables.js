const d = document;
const ls = localStorage;
const $darkBtn = d.querySelector('.dark-mode-btn');
const $loader = d.querySelector('.loader');
const $detailCountry = d.querySelector('main.detail-country');
const searchParagram = new URLSearchParams(window.location.search);
const $mainContent = d.querySelector('#main-content');
const $paginacionDiv = d.querySelector('#paginacion');
const $inputCountry = d.querySelector('#country');
const $selectCountries = d.querySelector('#countries');

export { d, ls, $darkBtn, $loader, $detailCountry, searchParagram, $mainContent, $inputCountry, 
$paginacionDiv, $selectCountries };