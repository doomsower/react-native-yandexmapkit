
import { NativeModules } from 'react-native';

import YandexMapView from './src/YandexMapView';

module.exports = {
  YandexMapView,
  YandexMapKit: NativeModules.RNYandexMapKit
};