import React, {Component, PropTypes} from 'react';
import { requireNativeComponent, findNodeHandle, View, NativeModules, Platform } from 'react-native'; 

class YandexMapView extends Component {

  static propTypes = {
    //Android-only props

    showBuiltInScreenButtons: PropTypes.bool,
    showFindMeButton: PropTypes.bool,
    showJamsButton: PropTypes.bool,
    showScaleView: PropTypes.bool,
    showZoomButtons: PropTypes.bool,
    interactive: PropTypes.bool,
    hdMode: PropTypes.bool,
    
    //Cross-platform props

    showTraffic: PropTypes.bool,
    showMyLocation: PropTypes.bool,
    nightMode: PropTypes.bool,
    geocodingEnabled: PropTypes.bool,

    region: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      latitudeDelta: PropTypes.number,
      longitudeDelta: PropTypes.number,
    }),
    inititalRegion: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      latitudeDelta: PropTypes.number,
      longitudeDelta: PropTypes.number,
    }),
    onInteraction: PropTypes.func, 
    onGeocoding: PropTypes.func, 
    ...View.propTypes 
  };

  static defaultProps = {
    showBuiltInScreenButtons: false,
    showFindMeButton: false,
    showJamsButton: false,
    showScaleView: false,
    showZoomButtons: false,
    interactive: true,
    hdMode: false,

    showTraffic: false,
    showMyLocation: false,
    nightMode: false,
    geocodingEnabled: false,
  };

  _prevRegion = null;
  _map = null;

  componentDidMount() {
    const { region, inititalRegion } = this.props;
    if (region) {
      this._map.setNativeProps({ region });
    } else if (inititalRegion) {
      this._map.setNativeProps({ region: inititalRegion });
    }
  }

  componentWillUpdate(nextProps) {
    if (!this._prevRegion || !nextProps.region) 
      return;
    if (
      this._prevRegion.latitude  !== nextProps.region.latitude ||
      this._prevRegion.longitude  !== nextProps.region.longitude ||
      this._prevRegion.latitudeDelta !== nextProps.region.latitudeDelta ||
      this._prevRegion.longitudeDelta !== nextProps.region.longitudeDelta
    ) {
      this._map.setNativeProps({ region: nextProps.region });
    }
  }

  render() {
    //Omit region and set it via setNativeProps
    const {region, inititalRegion, ...rest} = this.props;
    return (
      <RNYandexMapView ref={map => {this._map = map}} {...rest} 
                       onMapEvent={this.onMapEventInternal}
                       onGeocodingEvent={this.onGeocodingEventInternal}
                       />
    );
  }

  onMapEventInternal = (event) => {
    const {latitude, longitude, latitudeDelta, longitudeDelta, type} = event.nativeEvent;
    this._prevRegion = {latitude, longitude, latitudeDelta, longitudeDelta};
    if (this.props.onInteraction){
      this.props.onInteraction(event.nativeEvent);
    }
  };

  onGeocodingEventInternal = (event) => {
    if (this.props.onGeocoding){
      this.props.onGeocoding(event.nativeEvent);
    }
  };

  runCommand = (name, args) => {
    switch (Platform.OS) {
      case 'android':
        NativeModules.UIManager.dispatchViewManagerCommand(
          findNodeHandle(this._map),
          NativeModules.UIManager.RNYandexMapView.Commands[name],
          args
        );
        break;

      case 'ios':
        NativeModules.RNYandexMapViewManager[name].apply(
          NativeModules.RNYandexMapViewManager[name],
          [findNodeHandle(this._map), ...args]
        );
        break;

      default:
        break;
    }
  };

  animateToCoordinate = (coordinate) => {
    this.runCommand('animateToCoordinate', [coordinate]);
  };
}

const RNYandexMapView = requireNativeComponent('RNYandexMapView', YandexMapView, {nativeOnly: {onMapEvent: true, onGeocodingEvent: true}});

module.exports = YandexMapView;