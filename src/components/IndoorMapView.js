import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Floor maps
const floorMaps = {
  1: require('../assets/images/floor1.png'),
  2: require('../assets/images/floor2.png'),
  3: require('../assets/images/floor3.png'),
};

// Mock points of interest
const pointsOfInterest = {
  1: [
    { id: 'entrance', name: 'Main Entrance', x: 100, y: 200 },
    { id: 'reception', name: 'Reception', x: 150, y: 180 },
    { id: 'emergency', name: 'Emergency Room', x: 250, y: 150 },
    { id: 'cafeteria', name: 'Cafeteria', x: 180, y: 300 },
  ],
  2: [
    { id: 'cardiology', name: 'Cardiology', x: 120, y: 150 },
    { id: 'radiology', name: 'Radiology', x: 220, y: 180 },
    { id: 'laboratory', name: 'Laboratory', x: 180, y: 250 },
  ],
  3: [
    { id: 'surgery', name: 'Surgery Wing', x: 150, y: 150 },
    { id: 'pediatrics', name: 'Pediatrics', x: 250, y: 200 },
    { id: 'icu', name: 'ICU', x: 180, y: 280 },
  ],
};

const IndoorMapView = ({ 
  currentFloor = 1, 
  userPosition = { x: 120, y: 220 }, 
  destination = null,
  onFloorChange,
  onLocationSelect,
}) => {
  const [floor, setFloor] = useState(currentFloor);
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
  
  // Update floor when currentFloor prop changes
  useEffect(() => {
    setFloor(currentFloor);
  }, [currentFloor]);
  
  // Handle floor change
  const handleFloorChange = (newFloor) => {
    setFloor(newFloor);
    if (onFloorChange) {
      onFloorChange(newFloor);
    }
  };
  
  // Handle map layout to get dimensions
  const handleMapLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setMapDimensions({ width, height });
  };
  
  // Handle location selection
  const handleLocationSelect = (location) => {
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Floor selector */}
      <View style={styles.floorSelector}>
        {Object.keys(floorMaps).map((floorNum) => (
          <TouchableOpacity
            key={floorNum}
            style={[
              styles.floorButton,
              parseInt(floorNum) === floor ? styles.activeFloorButton : null,
            ]}
            onPress={() => handleFloorChange(parseInt(floorNum))}
          >
            <Text 
              style={[
                styles.floorButtonText,
                parseInt(floorNum) === floor ? styles.activeFloorButtonText : null,
              ]}
            >
              {floorNum}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Map view */}
      <View style={styles.mapContainer} onLayout={handleMapLayout}>
        <Image
          source={floorMaps[floor]}
          style={styles.mapImage}
          resizeMode="contain"
        />
        
        {/* Points of interest */}
        {pointsOfInterest[floor].map((poi) => (
          <TouchableOpacity
            key={poi.id}
            style={[
              styles.poiMarker,
              {
                left: poi.x,
                top: poi.y,
              },
              destination && destination.id === poi.id ? styles.destinationMarker : null,
            ]}
            onPress={() => handleLocationSelect(poi)}
          >
            <Ionicons 
              name={destination && destination.id === poi.id ? "location" : "location-outline"} 
              size={24} 
              color={destination && destination.id === poi.id ? "#FF5252" : "#3F51B5"} 
            />
            <View style={styles.poiLabelContainer}>
              <Text style={styles.poiLabel}>{poi.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
        
        {/* User position */}
        {userPosition && (
          <View
            style={[
              styles.userMarker,
              {
                left: userPosition.x,
                top: userPosition.y,
              },
            ]}
          >
            <View style={styles.userDot} />
            <View style={styles.userRing} />
          </View>
        )}
        
        {/* Path to destination (simplified) */}
        {destination && userPosition && (
          <View
            style={[
              styles.pathLine,
              {
                left: userPosition.x,
                top: userPosition.y,
                width: Math.abs(destination.x - userPosition.x),
                transform: [
                  { rotate: Math.atan2(destination.y - userPosition.y, destination.x - userPosition.x) + 'rad' },
                  { translateX: Math.abs(destination.x - userPosition.x) / 2 },
                ],
              },
            ]}
          />
        )}
      </View>
      
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.userDot, styles.legendDot]} />
          <Text style={styles.legendText}>Your Location</Text>
        </View>
        <View style={styles.legendItem}>
          <Ionicons name="location-outline" size={18} color="#3F51B5" />
          <Text style={styles.legendText}>Point of Interest</Text>
        </View>
        <View style={styles.legendItem}>
          <Ionicons name="location" size={18} color="#FF5252" />
          <Text style={styles.legendText}>Destination</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  floorSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  floorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeFloorButton: {
    backgroundColor: '#3F51B5',
  },
  floorButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555555',
  },
  activeFloorButtonText: {
    color: '#FFFFFF',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  poiMarker: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -12 }, { translateY: -24 }],
  },
  destinationMarker: {
    zIndex: 10,
  },
  poiLabelContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  poiLabel: {
    fontSize: 10,
    color: '#333333',
  },
  userMarker: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  userDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userRing: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(76, 175, 80, 0.5)',
    position: 'absolute',
  },
  pathLine: {
    position: 'absolute',
    height: 3,
    backgroundColor: '#FF5252',
    zIndex: 1,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#555555',
    marginLeft: 5,
  },
});

export default IndoorMapView;
