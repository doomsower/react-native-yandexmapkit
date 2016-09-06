import React, {Component, PropTypes} from 'react';
import { requireNativeComponent, View } from 'react-native'; 

class YandexMapView extends Component {

  static propTypes = {
    showBuiltInScreenButtons: PropTypes.bool,
    showFindMeButton: PropTypes.bool,
    showJamsButton: PropTypes.bool,
    showScaleView: PropTypes.bool,
    showZoomButtons: PropTypes.bool,
    showMyLocation: PropTypes.bool,
    interactive: PropTypes.bool,
    hdMode: PropTypes.bool,
    showTraffic: PropTypes.bool,
    nightMode: PropTypes.bool,
    geocodingEnabled: PropTypes.bool,
    region: PropTypes.shape({
      lat: PropTypes.number,
      lon: PropTypes.number,
      zoom: PropTypes.number
    }),
    inititalRegion: PropTypes.shape({
      lat: PropTypes.number,
      lon: PropTypes.number,
      zoom: PropTypes.number
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
      this._prevRegion.lat  !== nextProps.region.lat ||
      this._prevRegion.lon  !== nextProps.region.lon ||
      this._prevRegion.zoom !== nextProps.region.zoom
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
    const {lat, lon, zoom, type} = event.nativeEvent;
    this._prevRegion = {lat, lon, zoom};
    if (this.props.onInteraction){
      this.props.onInteraction(event.nativeEvent);
    }
  };

  onGeocodingEventInternal = (event) => {
    if (this.props.onGeocoding){
      this.props.onGeocoding(event.nativeEvent);
    }
  }
}

const RNYandexMapView = requireNativeComponent('RNYandexMapView', YandexMapView, {nativeOnly: {onMapEvent: true, onGeocodingEvent: true}});

module.exports = YandexMapView;