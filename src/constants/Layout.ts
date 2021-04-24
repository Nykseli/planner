import { Dimensions } from 'react-native';

const wWidth = Dimensions.get('window').width;
const wHeight = Dimensions.get('window').height;
const sWidth = Dimensions.get('screen').width;
const sHeight = Dimensions.get('screen').height;

export default {
  window: {
    width: wWidth,
    height: wHeight,
  },
  screen: {
    width: sWidth,
    height: sHeight,
  },
  isSmallDevice: wWidth < 375,
};
