import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useBeacon } from '../context/BeaconContext';
import CompassView from '../components/CompassView';
import IndoorMapView from '../components/IndoorMapView';

// Mock data for clinics and departments
const mockClinics = {
  1: [
    { id: 'entrance', name: 'Main Entrance', x: 100, y: 200, floor: 1 },
    { id: 'reception', name: 'Reception', x: 150, y: 180, floor: 1 },
    { id: 'emergency', name: 'Emergency Room', x: 250, y: 150, floor: 1 },
    { id: 'cafeteria', name: 'Cafeteria', x: 180, y: 300, floor: 1 },
    { id: 'pharmacy', name: 'Pharmacy', x: 220, y: 250, floor: 1 },
  ],
  2: [
    { id: 'cardiology', name: 'Cardiology', x: 120, y: 150, floor: 2 },
    { id: 'radiology', name: 'Radiology', x: 220, y: 180, floor: 2 },
    { id: 'laboratory', name: 'Laboratory', x: 180, y: 250, floor: 2 },
  ],
  3: [
    { id: 'surgery', name: 'Surgery Wing', x: 150, y: 150, floor: 3 },
    { id: 'pediatrics', name: 'Pediatrics', x: 250, y: 200, floor: 3 },
    { id: 'icu', name: 'ICU', x: 180, y: 280, floor: 3 },
  ],
};

// Mock beacon data mapping
const mockBeaconMapping = {
  '00000000-0000-0000-0000-000000000000_1_1': { 
    floor: 1, 
    x: 100, 
    y: 200, 
    nearestClinic: 'entrance' 
  },
  '00000000-0000-0000-0000-000000000000_1_2': { 
    floor: 1, 
    x: 250, 
    y: 150, 
    nearestClinic: 'emergency' 
  },
  '00000000-0000-0000-0000-000000000000_2_1': { 
    floor: 2, 
    x: 120, 
    y: 150, 
    nearestClinic: 'cardiology' 
  },
  '00000000-0000-0000-0000-000000000000_2_2': { 
    floor: 2, 
    x: 220, 
    y: 180, 
    nearestClinic: 'radiology' 
  },
  '00000000-0000-0000-0000-000000000000_3_1': { 
    floor: 3, 
    x: 150, 
    y: 150, 
    nearestClinic: 'surgery' 
  },
  '00000000-0000-0000-0000-000000000000_3_2': { 
    floor: 3, 
    x: 250, 
    y: 200, 
    nearestClinic: 'pediatrics' 
  },
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const { 
    beacons, 
    nearestBeacon, 
    isScanning, 
    permissionsGranted, 
    error, 
    startScanning, 
    stopScanning 
  } = useBeacon();
  
  const [currentFloor, setCurrentFloor] = useState(1);
  const [userPosition, setUserPosition] = useState({ x: 120, y: 220 });
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'compass'
  const [heading, setHeading] = useState(0);
  const [distance, setDistance] = useState(null);
  
  // Start scanning for beacons when component mounts
  useEffect(() => {
    if (permissionsGranted) {
      startScanning();
    }
    
    // Simulate compass heading changes
    const headingInterval = setInterval(() => {
      if (selectedDestination) {
        // In a real app, this would use device orientation and destination coordinates
        // For this POC, we'll simulate heading changes
        setHeading(prev => (prev + 5) % 360);
      }
    }, 1000);
    
    return () => {
      stopScanning();
      clearInterval(headingInterval);
    };
  }, [permissionsGranted, selectedDestination]);
  
  // Update user position based on nearest beacon
  useEffect(() => {
    if (nearestBeacon) {
      const beaconId = nearestBeacon.id;
      const beaconInfo = mockBeaconMapping[beaconId];
      
      if (beaconInfo) {
        setCurrentFloor(beaconInfo.floor);
        setUserPosition({ x: beaconInfo.x, y: beaconInfo.y });
      }
    }
  }, [nearestBeacon]);
  
  // Calculate distance to destination
  useEffect(() => {
    if (selectedDestination && userPosition) {
      // In a real app, this would use actual pathfinding
      // For this POC, we'll use a simple Euclidean distance
      const dx = selectedDestination.x - userPosition.x;
      const dy = selectedDestination.y - userPosition.y;
      let dist = Math.sqrt(dx * dx + dy * dy) / 10; // Scale for demo
      
      // Add floor difference penalty
      if (selectedDestination.floor !== currentFloor) {
        dist += 20 * Math.abs(selectedDestination.floor - currentFloor);
      }
      
      setDistance(dist);
    } else {
      setDistance(null);
    }
  }, [selectedDestination, userPosition, currentFloor]);
  
  // Handle floor change
  const handleFloorChange = (floor) => {
    setCurrentFloor(floor);
  };
  
  // Handle destination selection
  const handleDestinationSelect = (destination) => {
    setSelectedDestination(destination);
  };
  
  // Handle search button press
  const handleSearchPress = () => {
    navigation.navigate('Search', {
      onLocationSelect: (location) => {
        // Find the corresponding map point
        const clinics = mockClinics[location.floor];
        const clinic = clinics.find(c => c.id === location.id);
        
        if (clinic) {
          setSelectedDestination(clinic);
          setCurrentFloor(clinic.floor);
        }
      }
    });
  };
  
  // Handle navigation button press
  const handleNavigatePress = () => {
    if (selectedDestination) {
      navigation.navigate('Navigation', {
        origin: {
          name: getNearestClinicName(),
          floor: currentFloor,
          x: userPosition.x,
          y: userPosition.y
        },
        destination: selectedDestination,
        currentFloor,
        distance
      });
    }
  };
  
  // Get name of nearest clinic based on user position
  const getNearestClinicName = () => {
    if (!nearestBeacon) return 'Unknown Location';
    
    const beaconId = nearestBeacon.id;
    const beaconInfo = mockBeaconMapping[beaconId];
    
    if (beaconInfo && beaconInfo.nearestClinic) {
      const clinics = mockClinics[beaconInfo.floor];
      const clinic = clinics.find(c => c.id === beaconInfo.nearestClinic);
      return clinic ? clinic.name : 'Unknown Location';
    }
    
    return 'Unknown Location';
  };
  
  // Toggle between map and compass view
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'map' ? 'compass' : 'map');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Hospital Navigator</Text>
          <Text style={styles.headerSubtitle}>
            {isScanning ? 'Scanning for beacons...' : 'Beacon scanning inactive'}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={handleSearchPress}
        >
          <Ionicons name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {/* Current location info */}
      <View style={styles.locationInfoContainer}>
        <Ionicons name="location" size={24} color="#3F51B5" />
        <View style={styles.locationTextContainer}>
          <Text style={styles.locationLabel}>Current Location:</Text>
          <Text style={styles.locationName}>{getNearestClinicName()}</Text>
        </View>
        <Text style={styles.floorBadge}>Floor {currentFloor}</Text>
      </View>
      
      {/* Main content */}
      <View style={styles.contentContainer}>
        {/* View toggle */}
        <View style={styles.viewToggleContainer}>
          <TouchableOpacity
            style={[
              styles.viewToggleButton,
              viewMode === 'map' ? styles.activeViewToggleButton : null,
            ]}
            onPress={() => setViewMode('map')}
          >
            <Ionicons 
              name="map" 
              size={20} 
              color={viewMode === 'map' ? '#FFFFFF' : '#777777'} 
            />
            <Text 
              style={[
                styles.viewToggleText,
                viewMode === 'map' ? styles.activeViewToggleText : null,
              ]}
            >
              Map
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewToggleButton,
              viewMode === 'compass' ? styles.activeViewToggleButton : null,
            ]}
            onPress={() => setViewMode('compass')}
          >
            <Ionicons 
              name="compass" 
              size={20} 
              color={viewMode === 'compass' ? '#FFFFFF' : '#777777'} 
            />
            <Text 
              style={[
                styles.viewToggleText,
                viewMode === 'compass' ? styles.activeViewToggleText : null,
              ]}
            >
              Compass
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Map or Compass view */}
        {viewMode === 'map' ? (
          <IndoorMapView
            currentFloor={currentFloor}
            userPosition={userPosition}
            destination={selectedDestination}
            onFloorChange={handleFloorChange}
            onLocationSelect={handleDestinationSelect}
          />
        ) : (
          <CompassView
            heading={heading}
            destination={selectedDestination ? selectedDestination.name : null}
            distance={distance}
          />
        )}
      </View>
      
      {/* Bottom action bar */}
      <View style={styles.actionBar}>
        {!permissionsGranted ? (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={startScanning}
          >
            <Ionicons name="bluetooth" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Enable Bluetooth</Text>
          </TouchableOpacity>
        ) : selectedDestination ? (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleNavigatePress}
          >
            <Ionicons name="navigate" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Start Navigation</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleSearchPress}
          >
            <Ionicons name="search" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Find a Clinic</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Error message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#3F51B5',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  locationLabel: {
    fontSize: 12,
    color: '#777777',
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  floorBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#3F51B5',
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  viewToggleContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 4,
    zIndex: 10,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  viewToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeViewToggleButton: {
    backgroundColor: '#3F51B5',
  },
  viewToggleText: {
    fontSize: 14,
    color: '#777777',
    marginLeft: 4,
  },
  activeViewToggleText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  actionBar: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3F51B5',
    borderRadius: 8,
    paddingVertical: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  errorContainer: {
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderTopWidth: 1,
    borderTopColor: '#FFCDD2',
  },
  errorText: {
    fontSize: 14,
    color: '#D32F2F',
    textAlign: 'center',
  },
});

export default HomeScreen;
