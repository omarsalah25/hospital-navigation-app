import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const FloorMapImage = ({ floor }) => {
  // Get the floor image based on the floor number
  const getFloorImage = () => {
    switch (floor) {
      case 1:
        return require('../assets/images/floor1.png');
      case 2:
        return require('../assets/images/floor2.png');
      case 3:
        return require('../assets/images/floor3.png');
      default:
        return require('../assets/images/floor1.png');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={getFloorImage()}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.7,
  },
});

export default FloorMapImage;
