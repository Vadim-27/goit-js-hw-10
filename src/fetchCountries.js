import axios from 'axios';

export const fetchCountries = (inputCountry) => {
    return axios.get(`https://restcountries.com/v3.1/name/${inputCountry}?fields=name,capital,population,flags,languages`).then(({ data }) => data);
}