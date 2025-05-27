import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CompassView = ({ heading, destination, distance }) => {
  // Calculate the rotation angle for the compass arrow
  // In a real app, this would use the device's compass and the destination coordinates
  // For this POC, we'll use a mock heading value
  const arrowRotation = { transform: [{ rotate: `${heading}deg` }] };

  return (
    <View style={styles.container}>
      <View style={styles.compassContainer}>
        <View style={styles.compassRing}>
          <View style={styles.compassDirections}>
            <Text style={[styles.directionText, styles.northText]}>N</Text>
            <Text style={[styles.directionText, styles.eastText]}>E</Text>
            <Text style={[styles.directionText, styles.southText]}>S</Text>
            <Text style={[styles.directionText, styles.westText]}>W</Text>
          </View>
          
          {/* Compass arrow pointing to destination */}
          <View style={[styles.compassArrow, arrowRotation]}>
            <Ionicons name="arrow-up" size={40} color="#FF5252" />
          </View>
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.destinationText}>{destination || 'No destination selected'}</Text>
        {distance && (
          <Text style={styles.distanceText}>
            {typeof distance === 'number' ? `${distance.toFixed(1)} meters away` : distance}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  compassContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  compassRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  compassDirections: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  directionText: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555555',
  },
  northText: {
    top: 10,
    alignSelf: 'center',
  },
  eastText: {
    right: 10,
    top: '50%',
    transform: [{ translateY: -9 }],
  },
  southText: {
    bottom: 10,
    alignSelf: 'center',
  },
  westText: {
    left: 10,
    top: '50%',
    transform: [{ translateY: -9 }],
  },
  compassArrow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinationText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  distanceText: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
  },
});

export default CompassView;
