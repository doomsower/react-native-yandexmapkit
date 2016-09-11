import React, {Component, PropTypes} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { YandexMapKit, YandexMapView } from 'react-native-yandexmapkit';
import { YANDEXMAPKIT_API_KEY } from 'react-native-dotenv';

YandexMapKit.setApiKey(YANDEXMAPKIT_API_KEY);

export default class App extends Component {

  state = {
    region: {
      latitude: 59.947212,
      longitude: 30.336098,
      latitudeDelta: 0.09764120700999257,
      longitudeDelta: 0.1235961914638466,
    },
    address: ''
  };

  render() {
    const {latitude, longitude, latitudeDelta, longitudeDelta} = this.state.region;
    return (
      <View style={styles.container}>
        <YandexMapView ref="yandexMap" onInteraction={this.onInteraction} region={this.state.region}
                       showMyLocation={true} geocodingEnabled={true} onGeocoding={this.onGeocoding}
                       showMyLocationButton={true} disableAndroidGeocoding={false}/>
        <View style={styles.info}>
          <Text>{`${latitude.toPrecision(4)} - ${longitude.toPrecision(4)} (${latitudeDelta.toPrecision(4)} - ${longitudeDelta.toPrecision(4)})`}</Text>
          <Text>{this.state.address}</Text>
        </View>
      </View>
    );
  }

  onInteraction = (event) => {
    const {latitude, longitude, latitudeDelta, longitudeDelta, type} = event;
    console.log('Interaction', latitude, longitude, latitudeDelta, longitudeDelta, type);
    this.setState({region: {latitude, longitude, latitudeDelta, longitudeDelta}});
  };

  onGeocoding = (short, full) => {
    console.log('Geocoding response:', short, full);
    if (short){
      this.setState({address: short.displayName});
    }
  };

  resetRegion = () => {
    this.refs['yandexMap'].animateToCoordinate();
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonOverlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 16,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'stretch'
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
  }
});