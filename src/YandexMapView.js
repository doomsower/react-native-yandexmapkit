import React, {Component, PropTypes} from 'react';
import { 
  requireNativeComponent, 
  findNodeHandle, 
  NativeModules, 
  View, 
  StyleSheet, 
  Platform,
  Image,
  TouchableOpacity } from 'react-native'; 

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
    const {region, inititalRegion, style, showMyLocationButton, renderMyLocationButton, myLocationButtonPosition, ...rest} = this.props;
    return (
      <View style={[styles.container, style]}>
        <RNYandexMapView ref={map => {this._map = map}} 
                        {...rest} 
                        style={styles.container}
                        onMapEvent={this.onMapEventInternal}
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
    backgroundColor: 'rgba(220,220,220,0.75)',
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