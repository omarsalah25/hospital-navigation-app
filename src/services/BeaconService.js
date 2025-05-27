import { BleManager } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';
import * as Location from 'expo-location';

class BeaconService {
  constructor() {
    this.bleManager = new BleManager();
    this.scanning = false;
    this.beacons = new Map();
    this.listeners = [];
  }

  async requestPermissions() {
    try {
      // Request location permissions (required for Bluetooth scanning)
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      
      // For Android, we need additional Bluetooth permissions
      if (Platform.OS === 'android') {
        if (Platform.Version >= 31) { // Android 12+
          const bluetoothScanStatus = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
              title: 'Bluetooth Scan Permission',
              message: 'This app needs access to Bluetooth to find nearby beacons.',
              buttonPositive: 'OK',
            }
          );
          
          const bluetoothConnectStatus = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
              title: 'Bluetooth Connect Permission',
              message: 'This app needs access to Bluetooth to connect to beacons.',
              buttonPositive: 'OK',
            }
          );
          
          return (
            locationStatus.status === 'granted' &&
            bluetoothScanStatus === PermissionsAndroid.RESULTS.GRANTED &&
            bluetoothConnectStatus === PermissionsAndroid.RESULTS.GRANTED
          );
        } else {
          const fineLocationStatus = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location to find nearby beacons.',
              buttonPositive: 'OK',
            }
          );
          
          return (
            locationStatus.status === 'granted' &&
            fineLocationStatus === PermissionsAndroid.RESULTS.GRANTED
          );
        }
      }
      
      return locationStatus.status === 'granted';
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  async startScanning() {
    try {
      const hasPermissions = await this.requestPermissions();
      
      if (!hasPermissions) {
        console.error('Bluetooth scanning requires permissions');
        return false;
      }
      
      if (this.scanning) {
        return true;
      }
      
      // Start Bluetooth adapter if needed
      const state = await this.bleManager.state();
      if (state !== 'PoweredOn') {
        await new Promise((resolve) => {
          const subscription = this.bleManager.onStateChange((newState) => {
            if (newState === 'PoweredOn') {
              subscription.remove();
              resolve();
            }
          }, true);
        });
      }
      
      this.scanning = true;
      
      // Start scanning for all devices (we'll filter for iBeacons in the handler)
      this.bleManager.startDeviceScan(
        null, // null means scan for all services
        { allowDuplicates: true },
        (error, device) => {
          if (error) {
            console.error('Scanning error:', error);
            return;
          }
          
          if (!device) return;
          
          // Process the device to check if it's an iBeacon
          this.processDevice(device);
        }
      );
      
      return true;
    } catch (error) {
      console.error('Error starting scan:', error);
      this.scanning = false;
      return false;
    }
  }

  stopScanning() {
    if (!this.scanning) return;
    
    this.bleManager.stopDeviceScan();
    this.scanning = false;
  }

  processDevice(device) {
    // Check if the device has manufacturer data (iBeacons use this)
    const manufacturerData = device.manufacturerData;
    if (!manufacturerData) return;
    
    try {
      // For iOS, we can directly parse the manufacturer data
      // For Android, we need to extract from the advertisement data
      let beaconData;
      
      if (Platform.OS === 'ios') {
        beaconData = this.parseIosManufacturerData(manufacturerData);
      } else {
        beaconData = this.parseAndroidManufacturerData(manufacturerData);
      }
      
      if (!beaconData) return;
      
      const { uuid, major, minor, rssi, distance } = beaconData;
      
      // Create a unique key for this beacon
      const beaconKey = `${uuid}_${major}_${minor}`;
      
      // Update or add the beacon to our map
      this.beacons.set(beaconKey, {
        id: beaconKey,
        uuid,
        major,
        minor,
        rssi,
        distance,
        lastSeen: Date.now()
      });
      
      // Notify listeners
      this.notifyListeners();
    } catch (error) {
      console.error('Error processing device:', error);
    }
  }

  // Parse manufacturer data on iOS
  parseIosManufacturerData(data) {
    // This is a simplified implementation
    // In a real app, you would need to properly decode the binary data
    // For this POC, we'll return mock data
    return {
      uuid: '00000000-0000-0000-0000-000000000000',
      major: 1,
      minor: 1,
      rssi: -70,
      distance: 2.5
    };
  }

  // Parse manufacturer data on Android
  parseAndroidManufacturerData(data) {
    // This is a simplified implementation
    // In a real app, you would need to properly decode the binary data
    // For this POC, we'll return mock data
    return {
      uuid: '00000000-0000-0000-0000-000000000000',
      major: 1,
      minor: 1,
      rssi: -70,
      distance: 2.5
    };
  }

  // Calculate approximate distance based on RSSI
  calculateDistance(rssi, txPower = -59) {
    if (rssi === 0) {
      return -1; // Unknown distance
    }
    
    const ratio = rssi * 1.0 / txPower;
    if (ratio < 1.0) {
      return Math.pow(ratio, 10);
    } else {
      return 0.89976 * Math.pow(ratio, 7.7095) + 0.111;
    }
  }

  // Get all currently detected beacons
  getAllBeacons() {
    // Convert Map to Array
    return Array.from(this.beacons.values());
  }

  // Get the nearest beacon
  getNearestBeacon() {
    const beacons = this.getAllBeacons();
    if (beacons.length === 0) return null;
    
    // Sort by distance (ascending)
    return beacons.sort((a, b) => a.distance - b.distance)[0];
  }

  // Add a listener for beacon updates
  addListener(callback) {
    this.listeners.push(callback);
    return this.listeners.length - 1; // Return the index for removal
  }

  // Remove a listener
  removeListener(index) {
    if (index >= 0 && index < this.listeners.length) {
      this.listeners.splice(index, 1);
    }
  }

  // Notify all listeners of beacon updates
  notifyListeners() {
    const beacons = this.getAllBeacons();
    this.listeners.forEach(callback => {
      try {
        callback(beacons);
      } catch (error) {
        console.error('Error in beacon listener:', error);
      }
    });
  }

  // Clean up resources
  destroy() {
    this.stopScanning();
    this.listeners = [];
    this.beacons.clear();
  }
}

// Singleton instance
const beaconService = new BeaconService();
export default beaconService;
