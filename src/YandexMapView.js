import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { 
  requireNativeComponent, 
  findNodeHandle, 
  NativeModules, 
  View, 
  StyleSheet, 
  Platform,
  Image,
  TouchableOpacity } from 'react-native'; 
import {makeDebouncedGeocoding} from './YandexMapKit';

const AndroidMapEvent = {
  EMPTY: 0,
  SCROLL_BEGIN: 1,
  SCROLL_MOVE: 2,
  SCROLL_END: 3,
  ZOOM_BEGIN: 4,
  ZOOM_MOVE: 5,
  ZOOM_END: 6,
  SCALE_BEGIN: 7,
  SCALE_MOVE: 8,
  SCALE_END: 9,
  LONG_PRESS: 10,
};

class YandexMapView extends Component {

  static propTypes = {
    //React-native UI props

    showMyLocationButton: PropTypes.bool,
    myLocationButtonPosition: PropTypes.any,
    renderMyLocationButton: PropTypes.func,

    //Android-only props

    showBuiltInScreenButtons: PropTypes.bool,
    showFindMeButton: PropTypes.bool,
    showJamsButton: PropTypes.bool,
    showScaleView: PropTypes.bool,
    showZoomButtons: PropTypes.bool,
    interactive: PropTypes.bool,
    hdMode: PropTypes.bool,

    //Geocoding
    geocodingEnabled: PropTypes.bool,
    geocodingOptions: PropTypes.object,
    geocodingApiKey: PropTypes.string,
    disableAndroidGeocoding: PropTypes.bool,
    
    //Cross-platform props

    showTraffic: PropTypes.bool,
    showMyLocation: PropTypes.bool,
    nightMode: PropTypes.bool,

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
    geocodingOptions: {
      sco: 'latlong',
      kind: 'house',
    },
  };

  _prevRegion = null;
  _map = null;
  _debouncedGeocoding = null;

  componentDidMount() {
    const { region, inititalRegion } = this.props;
    if (region) {
      this._map.setNativeProps({ region });
    } else if (inititalRegion) {
      this._map.setNativeProps({ region: inititalRegion });
    }
    const {geocodingOptions, geocodingApiKey, onGeocoding} = this.props;
    this._debouncedGeocoding = makeDebouncedGeocoding(geocodingOptions, onGeocoding, geocodingApiKey);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.geocodingApiKey != this.props.geocodingApiKey || 
      nextProps.geocodingOptions != this.props.geocodingOptions ||
      nextProps.onGeocoding != this.props.onGeocoding
    ){
      this._debouncedGeocoding = this.createDebouncedGeocoding(nextProps.geocodingOptions, nextProps.onGeocoding, nextProps.geocodingApiKey);
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

  componentWillUnmount() {
    if (this._debouncedGeocoding){
      this._debouncedGeocoding.cancel();
    }
  }

  render() {
    //Omit region and set it via setNativeProps
    const {region, inititalRegion, style, showMyLocationButton, renderMyLocationButton, myLocationButtonPosition, geocodingEnabled, disableAndroidGeocoding, ...rest} = this.props;
    const gcEnabled = geocodingEnabled && (Platform.OS === 'ios' || !disableAndroidGeocoding);
    return (
      <View style={[styles.container, style]}>
        <RNYandexMapView ref={map => {this._map = map}} 
                        {...rest} 
                        style={styles.container}
                        onMapEvent={this.onMapEventInternal}
                        geocodingEnabled={gcEnabled}
                        onGeocodingEvent={this.onGeocodingEventInternal}
                        />
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          { this.renderMyLocationButton() }
        </View>
      </View>
    );
  }

  renderMyLocationButton = () => {
    const {showMyLocationButton, renderMyLocationButton, myLocationButtonPosition, ...rest} = this.props;
        const renderLocatioButton = renderMyLocationButton ? renderMyLocationButton : this.renderDefaultMyLocationButton;
    const locationWrapperStyle = myLocationButtonPosition ? myLocationButtonPosition : styles.button;
    if (!showMyLocationButton)
      return null;
    return (
      <View style={locationWrapperStyle}>
        {renderLocatioButton()}
      </View>
    );
  };

  onMapEventInternal = (event) => {
    const {latitude, longitude, latitudeDelta, longitudeDelta, type} = event.nativeEvent;
    this._prevRegion = {latitude, longitude, latitudeDelta, longitudeDelta};
    if (this.props.onInteraction){
      this.props.onInteraction(event.nativeEvent);
    }
    
    //Handle geocoding
    const {geocodingEnabled, disableAndroidGeocoding} = this.props;
    if (
      geocodingEnabled && 
      (Platform.OS === 'ios' || disableAndroidGeocoding) &&
      (type === undefined || type === AndroidMapEvent.SCALE_END || type === AndroidMapEvent.SCROLL_END || type === AndroidMapEvent.ZOOM_END)
    )
    {
      this._debouncedGeocoding(latitude, longitude);
    }
  };

  //Native android-only event
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

  /**
   * Animates to given {latitude,longitude}, or to user's location, if coordinate is undefined
   */
  animateToCoordinate = (coordinate) => {
    this.runCommand('animateToCoordinate', [coordinate]);
  };

  renderDefaultMyLocationButton = () => {
    return (
      <TouchableOpacity onPress={() => this.animateToCoordinate()}>
        <View style={styles.iconWrapper}>
          <Image source={require('./assets/my_location.png')}/>
        </View>
      </TouchableOpacity>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgb(220,220,220)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  button: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});

const RNYandexMapView = requireNativeComponent('RNYandexMapView', YandexMapView, {nativeOnly: {onMapEvent: true, onGeocodingEvent: true}});

module.exports = YandexMapView;
