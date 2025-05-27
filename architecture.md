# Hospital Navigation App Architecture

## Overview
This document outlines the architecture for a proof-of-concept hospital navigation application using iBeacon technology. The app will help users locate clinics within a hospital, differentiate between floors, and navigate to their destination.

## Application Structure

### Core Components
1. **Beacon Detection Service**
   - Handles Bluetooth scanning for iBeacons
   - Calculates proximity to beacons
   - Determines current floor and location
   - Provides real-time position updates

2. **Navigation Engine**
   - Processes beacon data to determine user position
   - Calculates routes between locations
   - Provides turn-by-turn directions
   - Handles floor transitions

3. **Data Management**
   - Stores and manages beacon information
   - Maintains clinic/department data
   - Manages hospital map data
   - Handles search indexing

4. **User Interface**
   - Compass view for directional guidance
   - Indoor map visualization
   - Search interface for finding destinations
   - Turn-by-turn navigation display
   - Floor selector and indicator

## Data Models

### Beacon
```javascript
{
  id: string,           // Unique identifier
  uuid: string,         // iBeacon UUID
  major: number,        // iBeacon major value
  minor: number,        // iBeacon minor value
  floor: number,        // Floor number
  x: number,            // X coordinate on map
  y: number,            // Y coordinate on map
  location: string      // Description of location
}
```

### Location
```javascript
{
  id: string,           // Unique identifier
  name: string,         // Name of clinic/department
  floor: number,        // Floor number
  category: string,     // Category (e.g., "Radiology", "Surgery")
  x: number,            // X coordinate on map
  y: number,            // Y coordinate on map
  description: string,  // Additional information
  nearestBeacons: string[] // IDs of nearby beacons
}
```

### Map
```javascript
{
  floor: number,        // Floor number
  image: string,        // Path to floor map image
  width: number,        // Map width in pixels
  height: number,       // Map height in pixels
  scale: number,        // Pixels to meters scale
  points: {             // Navigation points
    id: string,
    x: number,
    y: number,
    connections: string[] // IDs of connected points
  }[]
}
```

## Screen Flow
1. **Splash Screen**
   - App loading
   - Bluetooth permission request

2. **Home Screen**
   - Search bar
   - Floor selector
   - Current location indicator
   - Quick access to common destinations

3. **Map Screen**
   - Interactive indoor map
   - User position indicator
   - Points of interest
   - Floor selector

4. **Navigation Screen**
   - Turn-by-turn directions
   - Distance to destination
   - Compass arrow
   - Step-by-step instructions

5. **Search Screen**
   - Searchable list of clinics/departments
   - Filtering options
   - Recent searches

## State Management
- Use React Context API for global state management
- Local component state for UI-specific state
- Separate contexts for:
  - Beacon detection
  - Navigation
  - User preferences

## Technical Considerations

### Bluetooth Permissions
- Request Bluetooth permissions at app startup
- Handle permission denial gracefully
- Provide clear explanations for permission requests

### Battery Optimization
- Implement scanning intervals to reduce battery usage
- Adjust scanning frequency based on movement
- Provide battery usage warnings

### Accuracy Improvements
- Use triangulation with multiple beacons when available
- Implement signal smoothing algorithms
- Account for signal interference

## Future Backend Integration
- Design data models to be compatible with future API integration
- Implement service layer pattern to abstract data sources
- Use environment configuration for switching between mock and real data
- Prepare for dynamic beacon and location updates

## Technology Stack
- **React Native**: Core framework
- **Expo**: Development platform
- **React Navigation**: Navigation between screens
- **react-native-ble-plx**: Bluetooth Low Energy scanning
- **react-native-maps**: For map visualization (can be customized for indoor use)
- **AsyncStorage**: Local data persistence
- **react-native-reanimated**: Smooth animations for UI

## Testing Strategy
- Unit tests for core navigation algorithms
- Integration tests for beacon detection
- UI tests for critical user flows
- Manual testing with actual iBeacons for accuracy validation
