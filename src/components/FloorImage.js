import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';

// Mock floor map images
const createMockFloorImages = () => {
  // In a real app, these would be actual floor map images
  // For this POC, we'll create simple colored rectangles
  return {
    floor1: require('./floor1.png'),
    floor2: require('./floor2.png'),
    floor3: require('./floor3.png'),
  };
};

// Simple placeholder images for floors
const FloorImage = ({ floor }) => {
  const [dimensions, setDimensions] = useState({ width: 300, height: 400 });
  
  // Generate a simple colored rectangle as placeholder
  const getBackgroundColor = () => {
    switch (floor) {
      case 1: return '#E3F2FD'; // Light blue
      case 2: return '#E8F5E9'; // Light green
      case 3: return '#FFF3E0'; // Light orange
      default: return '#F5F5F5'; // Light gray
    }
  };
  
  return (
    <View 
      style={[
        styles.floorImage, 
        { 
          backgroundColor: getBackgroundColor(),
          width: dimensions.width,
          height: dimensions.height
        }
      ]}
    />
  );
};

const styles = StyleSheet.create({
  floorImage: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
  },
});

export default FloorImage;
