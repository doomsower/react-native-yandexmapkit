import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import * as YMK from 'react-native-yandexmapkit';
import { YANDEXMAPKIT_API_KEY } from 'react-native-dotenv';

const { YandexMapKit, YandexMapView } = YMK;

YandexMapKit.setApiKey(YANDEXMAPKIT_API_KEY);

export default class App extends Component {

  state = {
    region: {
      latitude: 59.950979336181184,
      longtitude: 30.33594348018638,
      latitudeDelta: 0.09764120700999257,
      longtitudeDelta: 0.1235961914638466,
    },
    address: ''
  };

  render() {
    const {latitude, longtitude, latitudeDelta, longtitudeDelta} = this.state.region;
    return (
      <View style={styles.container}>
        <YandexMapView style={styles.container} onInteraction={this.onInteraction} region={this.state.region}
                       showMyLocation={true} geocodingEnabled={true} onGeocoding={this.onGeocoding}/>
        <View style={styles.overlay}>
          <Text>{`${latitude.toPrecision(4)} - ${longtitude.toPrecision(4)} (${latitudeDelta.toPrecision(4)} - ${longtitudeDelta.toPrecision(4)})`}</Text>
          <Text>{this.state.address}</Text>
        </View>
      </View>
    );
  }

  onInteraction = (event) => {
    const {latitude, longtitude, latitudeDelta, longtitudeDelta, type} = event;
    console.log('Interaction', latitude, longtitude, latitudeDelta, longtitudeDelta, type);
    this.setState({region: {latitude, longtitude, latitudeDelta, longtitudeDelta}});
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
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
  }
});