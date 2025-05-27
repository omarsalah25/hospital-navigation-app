import React, { createContext, useState, useEffect, useContext } from 'react';
import beaconService from '../services/BeaconService';

// Create context
const BeaconContext = createContext(null);

// Provider component
export const BeaconProvider = ({ children }) => {
  const [beacons, setBeacons] = useState([]);
  const [nearestBeacon, setNearestBeacon] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [error, setError] = useState(null);

  // Initialize permissions
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const hasPermissions = await beaconService.requestPermissions();
        setPermissionsGranted(hasPermissions);
        if (!hasPermissions) {
          setError('Bluetooth permissions not granted');
        }
      } catch (err) {
        setError(`Error requesting permissions: ${err.message}`);
      }
    };

    checkPermissions();

    // Clean up on unmount
    return () => {
      beaconService.destroy();
    };
  }, []);

  // Start scanning when permissions are granted
  const startScanning = async () => {
    try {
      if (!permissionsGranted) {
        const hasPermissions = await beaconService.requestPermissions();
        setPermissionsGranted(hasPermissions);
        if (!hasPermissions) {
          setError('Bluetooth permissions not granted');
          return false;
        }
      }

      const success = await beaconService.startScanning();
      setIsScanning(success);
      
      if (success) {
        // Add listener for beacon updates
        beaconService.addListener((updatedBeacons) => {
          setBeacons(updatedBeacons);
          setNearestBeacon(beaconService.getNearestBeacon());
        });
      }
      
      return success;
    } catch (err) {
      setError(`Error starting scan: ${err.message}`);
      return false;
    }
  };

  // Stop scanning
  const stopScanning = () => {
    beaconService.stopScanning();
    setIsScanning(false);
  };

  // Get current floor based on nearest beacon
  const getCurrentFloor = () => {
    if (!nearestBeacon) return null;
    
    // In a real app, you would look up the floor from your beacon database
    // For this POC, we'll extract it from the beacon data
    return nearestBeacon.floor || 1;
  };

  // Get current location description
  const getCurrentLocation = () => {
    if (!nearestBeacon) return 'Unknown location';
    
    // In a real app, you would look up the location from your beacon database
    // For this POC, we'll return a mock location based on the beacon ID
    const beaconId = nearestBeacon.id;
    
    // Mock location mapping
    const locations = {
      '00000000-0000-0000-0000-000000000000_1_1': 'Main Entrance (Floor 1)',
      '00000000-0000-0000-0000-000000000000_1_2': 'Emergency Room (Floor 1)',
      '00000000-0000-0000-0000-000000000000_2_1': 'Cardiology Department (Floor 2)',
      '00000000-0000-0000-0000-000000000000_2_2': 'Radiology Department (Floor 2)',
      '00000000-0000-0000-0000-000000000000_3_1': 'Surgery Wing (Floor 3)',
      '00000000-0000-0000-0000-000000000000_3_2': 'Pediatrics Department (Floor 3)',
    };
    
    return locations[beaconId] || 'Unknown location';
  };

  return (
    <BeaconContext.Provider
      value={{
        beacons,
        nearestBeacon,
        isScanning,
        permissionsGranted,
        error,
        startScanning,
        stopScanning,
        getCurrentFloor,
        getCurrentLocation,
      }}
    >
      {children}
    </BeaconContext.Provider>
  );
};

// Custom hook to use the beacon context
export const useBeacon = () => {
  const context = useContext(BeaconContext);
  if (!context) {
    throw new Error('useBeacon must be used within a BeaconProvider');
  }
  return context;
};
