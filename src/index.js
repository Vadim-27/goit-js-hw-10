import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';


const DEBOUNCE_DELAY = 300;

const refs = {
    searchBox: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

let inputValue = '';

refs.searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
    e.preventDefault();
    inputValue = refs.searchBox.value.trim();
    if (inputValue === '') {
        clearRender();
        return;
    }

    
    fetchCountries(inputValue)
    .then(countries => {
      if (countries.length === 1) {
        clearRender();
        renderCountriTitle(countries);
          renderCountryInfo(countries);
          return;
      }  if (countries.length > 1 && countries.length <= 10) {
        clearRender();
          renderCountriTitle(countries);
          return;
      } if (countries.length > 10) {
        clearRender();
        Notiflix.Notify.info(
            'Too many mathces found. Please enter a more spesific name');
          return;
      }
    })
    .catch(catchError);

}
 

function renderCountriTitle(countries) {
    const markup = countries
    .map(country => {
        return`<li class="country-list__items">
        <img class="country-list__items-img" src="${country.flags.svg}" alt="flag">
        <p class="country-list__items-title">${country.name.official}</p>
      </li>`;
     }).join('');
refs.countryList.insertAdjacentHTML('beforeend', markup);
}

function renderCountryInfo(countries) {
  const langs = countries.map(({ languages }) => Object.values(languages).join(', '));
  const markup = countries
    .map(country => {
      return `<p class="info-text">Capital: ${country.capital}</p>
      <p class="info-text">Population: ${country.population}</p>
      <p class="info-text">languages: ${langs}</p>`;
    })
    .join('');
  refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}

function clearRender() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function catchError() {
  clearRender();
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

