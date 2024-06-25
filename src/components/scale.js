// utils/scale.js
import { Dimensions } from 'react-native';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Based on standard ~5" screen mobile device dimensions
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 1000;

const scale = size => {
  // Scale the size based on the screen dimensions
  const scaleWidth = width / guidelineBaseWidth;
  const scaleHeight = height / guidelineBaseHeight;
  const scaleFactor = Math.min(scaleWidth, scaleHeight);
  return size * scaleFactor;
};

export { scale };
