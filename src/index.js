import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener(
  'input',
  debounce(event => {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    if (event.target.value.trim() !== '') {
      fetchCountries(`${event.target.value}`.trim())
        .then(data => {
          if (data.length > 10) {
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
          } else {
            data.length == 1
              ? createCountryCard(data, refs.countryInfo)
              : createCountryList(data, refs.countryList);
          }
        })
        .catch(error => Notiflix.Notify.failure(`Oops, there is no country with that name`));
    }
  }, DEBOUNCE_DELAY),
);

function createCountryCard(data, node) {
  const markup = data
    .map(({ name, capital, population, flags, languages }) => {
      return `<div><img src="${flags.svg}"><h2>${
        name.official
      }</h2></div><p><b>Capital:</b> ${capital}</p><p><b>Population:</b> ${Intl.NumberFormat().format(
        population,
      )}</p><p><b>Languages:</b> ${Object.values(languages).join(', ')}</p>`;
    })
    .join('');

  node.innerHTML = markup;
}

function createCountryList(data, node) {
  const markup = data
    .map(({ name, flags }) => {
      return `<li><img src="${flags.svg}">${name.official}</li>`;
    })
    .join('');

  node.innerHTML = markup;
}