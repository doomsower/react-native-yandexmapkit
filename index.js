
import { NativeModules } from 'react-native';
import YandexMapView from './src/YandexMapView';

const YandexMapKit = NativeModules.RNYandexMapKit;

module.exports = {
  YandexMapView,
  YandexMapKit, 
};