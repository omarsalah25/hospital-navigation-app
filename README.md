# Hospital Navigation App with iBeacon - Setup and Usage Guide

## Project Overview

This proof-of-concept application demonstrates how iBeacon technology can be used for indoor navigation in a hospital setting. The app allows users to:

1. Locate themselves within the hospital using iBeacon technology
2. View their current position on an indoor map
3. Search for clinics and departments
4. Get directions to their destination with turn-by-turn navigation
5. Switch between map view and compass view for navigation

## Technical Implementation

The application is built using:
- React Native and Expo for cross-platform mobile development
- React Navigation for screen navigation
- React Native BLE PLX for Bluetooth/iBeacon detection
- Context API for state management
- Mock data for hospital layout, beacons, and clinics

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development) or Xcode (for iOS development)
- Physical device with Bluetooth capability for testing (recommended)

### Installation Steps

1. Clone the repository or extract the project files
```
git clone <repository-url>
```

2. Navigate to the project directory
```
cd hospital-navigation-app
```

3. Install dependencies
```
npm install
```
or
```
yarn install
```

4. Start the Expo development server
```
npx expo start
```

5. Run on a device or emulator
   - Scan the QR code with the Expo Go app on your device
   - Press 'a' to run on an Android emulator
   - Press 'i' to run on an iOS simulator

## Testing the Application

Since this is a proof-of-concept that relies on iBeacon technology, there are two ways to test the application:

### Option 1: Using Physical iBeacons (Recommended for Production)

1. Purchase iBeacon devices (e.g., Estimote, Kontakt.io)
2. Configure the beacons with the UUIDs, major, and minor values matching those in the mockData.json file
3. Place the beacons at the corresponding locations in your facility
4. Run the application on a physical device with Bluetooth enabled

### Option 2: Using Mock Data (For Development/Demo)

The application is pre-configured to work with mock data for demonstration purposes:

1. The app will simulate beacon detection and positioning
2. You can interact with all features without actual iBeacons
3. The mock data provides a realistic simulation of how the app would work with real beacons

## Application Features

### Home Screen
- Shows current location based on nearest beacon
- Displays current floor
- Allows switching between map and compass view
- Provides quick access to search and navigation

### Map Screen
- Interactive indoor map with floor selector
- User position indicator
- Points of interest markers
- Path visualization to selected destination

### Search Screen
- Searchable list of all clinics and departments
- Filtering by category
- Recent searches history
- Quick selection of destinations

### Navigation Screen
- Turn-by-turn directions to destination
- Distance and estimated time information
- Step-by-step instructions
- Floor transition guidance

## Extending the Application

### Adding Real Backend Integration

To replace the mock data with a real backend:

1. Create a backend service that provides APIs for:
   - Beacon information
   - Clinic/department data
   - Map data
   - Navigation paths

2. Modify the data loading in the application to fetch from your API endpoints
3. Update the BeaconContext.js file to use real beacon data

### Improving Beacon Detection

For more accurate positioning:

1. Implement trilateration using multiple beacons
2. Add signal filtering algorithms to reduce noise
3. Calibrate signal strength to distance calculations for your specific environment

### Adding More Features

Potential enhancements:

1. User authentication and personalization
2. Appointment integration
3. Accessibility features for users with disabilities
4. Voice guidance for navigation
5. Augmented reality overlays for more intuitive navigation

## Troubleshooting

### Bluetooth Issues
- Ensure Bluetooth is enabled on your device
- Check that location permissions are granted
- Restart the application if beacon detection stops working

### Navigation Problems
- Verify that the mock data is loaded correctly
- Check console logs for any errors in path calculation
- Ensure the selected destination is valid

## Contact and Support

For questions or support with this proof-of-concept, please contact the development team.

---

This application demonstrates the potential of iBeacon technology for indoor navigation in healthcare settings. While this proof-of-concept uses mock data, it provides a solid foundation for developing a production-ready solution with real beacons and backend integration.
