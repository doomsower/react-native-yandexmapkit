import React, {Component, PropTypes} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import * as YMK from 'react-native-yandexmapkit';
import { YANDEXMAPKIT_API_KEY } from 'react-native-dotenv';

const { YandexMapKit, YandexMapView } = YMK;

YandexMapKit.setApiKey(YANDEXMAPKIT_API_KEY);

export default class App extends Component {

  state = {
    region: {
      latitude: 59.950979336181184,
      longitude: 30.33594348018638,
      latitudeDelta: 0.09764120700999257,
      longitudeDelta: 0.1235961914638466,
    },
    address: ''
  };

  render() {
    const {latitude, longitude, latitudeDelta, longitudeDelta} = this.state.region;
    return (
      <View style={styles.container}>
        <YandexMapView ref="yandexMap" style={styles.container} onInteraction={this.onInteraction} region={this.state.region}
                       showMyLocation={true} geocodingEnabled={true} onGeocoding={this.onGeocoding}
                       showTraffic={false}/>
        <View style={styles.buttonOverlay}>
          <TouchableOpacity onPress={this.resetRegion} style={styles.button}>
            <Text>Reset region</Text>
          </TouchableOpacity>
        </View>  
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

  onGeocoding = (event) => {
    console.log('Geocoding response:', event);
    this.setState({address: event.displayName});
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