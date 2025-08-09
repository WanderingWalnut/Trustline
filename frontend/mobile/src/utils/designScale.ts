import { Dimensions } from 'react-native';

// Base frame from your Figma (tweak if your artboard is different)
const BASE_WIDTH = 360;
const BASE_HEIGHT = 800;

const { width, height } = Dimensions.get('window');

export const sx = (px: number) => (px * width) / BASE_WIDTH;   // scale X
export const sy = (px: number) => (px * height) / BASE_HEIGHT;  // scale Y
export const fs = (px: number) => (px * width) / BASE_WIDTH;    // font size scaling
