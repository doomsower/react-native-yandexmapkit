import { NativeModules } from 'react-native';
import qs from 'query-string';
import debounce from 'lodash/debounce';

const YandexMapKit = NativeModules.RNYandexMapKit;
const GEOCODE_BASE_URL = 'https://geocode-maps.yandex.ru/1.x/?';

function requestGeocoding(geocode, options, apikey) {
  const query = { geocode, ...options, format: 'json' };
  if (apikey !== undefined)
    query.apikey = apikey;
  const url = GEOCODE_BASE_URL + qs.stringify(query);
  return fetch(url)
    .then(response => response.json());
}

function makeDebouncedGeocoding(options, onComplete, apiKey, debounceWait = 150) {
  const apiCall = (geocode) => {
    requestGeocoding(geocode, options, apiKey)
      .then(json => {
        if (json.error) {
          consle.warn('Yandex geocoding api error: ' + json.error);
        }
        else if (onComplete) {
          //Provide full web geocoding response as second argument
          //First argument is extracted from the response to match Android native geocoding response
          const {featureMember: [firstFound, ...rest]} = json.response.GeoObjectCollection;
          let androidCompatibleResult;
          if (firstFound) {
            const [lon, lat] = firstFound.GeoObject.Point.pos.split(' ');
            const title = firstFound.GeoObject.name;
            const subtitle = firstFound.GeoObject.description;
            const kind = firstFound.GeoObject.metaDataProperty.GeocoderMetaData.kind;
            androidCompatibleResult = {
              displayName: subtitle + ', ' + title,
              kind,
              title,
              subtitle,
              point: {
                latitude: lat,
                longitude: lon,
              },
            };
          }
          onComplete(androidCompatibleResult, json);
        }
      })
      .catch(error => consle.warn('Yandex geocoding api error: ' + error));
  };
  if (options.hasOwnProperty('sco') || options.hasOwnProperty('kind')){
    return debounce((latitude, longitude) => apiCall(`${latitude},${longitude}`), debounceWait);
  } 
  else {
    return debounce(apiCall, debounceWait);
  }
}

module.exports = {
  setApiKey: apiKey => YandexMapKit.setApiKey(apiKey),
  requestGeocoding,
  makeDebouncedGeocoding,
}