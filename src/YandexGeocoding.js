import qs from 'query-string';

const BASE_URL = 'https://geocode-maps.yandex.ru/1.x/?';

export function requestGeocoding(geocode, options, apikey){
  const query = {geocode, ...options, format: 'json'};
  if (apikey !== undefined)
    query.apikey = apikey;
  const url = BASE_URL + qs.stringify(query);
  return fetch(url)
    .then(response => response.json());
}