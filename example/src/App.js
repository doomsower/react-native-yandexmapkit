import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {YandexMapView, YandexMapKit} from 'react-native-yandexmapkit';
import { YANDEXMAPKIT_API_KEY } from 'react-native-dotenv'

YandexMapKit.setApiKey(YANDEXMAPKIT_API_KEY);

export default class App extends Component {

  state = {
    region: {
      lat: 59.939095,
      lon: 30.315868,
      zoom: 12,
    },
    address: ''
  };

  render() {
    const {lat, lon, zoom} = this.state.region;
    return (
      <View style={styles.container}>
        <YandexMapView style={styles.container} onInteraction={this.onInteraction} region={this.state.region}
                       showMyLocation={true} geocodingEnabled={true} onGeocoding={this.onGeocoding}/>
        <View style={styles.overlay}>
          <Text>{`${lat.toPrecision(4)} - ${lon.toPrecision(4)} - ${zoom.toPrecision(2)} - ${this.state.address}`}</Text>
        </View>
      </View>
    );
  }

  onInteraction = (event) => {
    const {lat, lon, zoom, type} = event;
    console.log('Interaction', lat, lon, zoom, type);
    this.setState({region: {lat, lon, zoom}});
  };

  onGeocoding = (event) => {
    console.log('Geocoding response:', event);
    this.setState({address: event.displayName});
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
  }
});