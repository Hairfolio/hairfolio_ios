import {Navigator, Platform, Dimensions, NativeModules} from 'react-native';

export const EMPTY = 'EMPTY';
export const LOADING = 'LOADING';
export const LOADING_MORE = 'LOADING_MORE';
export const REFRESHING = 'REFRESHING';
export const LOADING_ERROR = 'LOADING_ERROR';
export const READY = 'READY';
export const UPDATING = 'UPDATING';
export const UPDATING_ERROR = 'UPDATING_ERROR';

export const NAVBAR_HEIGHT = Navigator.NavigationBar.Styles.General.TotalNavHeight;

var {
    width: deviceWidth,
    height: deviceHeight
} = Dimensions.get('window');

deviceHeight = Platform.OS === 'ios' ? deviceHeight : (NativeModules.ExtraDimensions['REAL_WINDOW_HEIGHT'] - (NativeModules.ExtraDimensions['STATUS_BAR_HEIGHT'] || 0) - (NativeModules.ExtraDimensions['SOFT_MENU_BAR_HEIGHT'] || 0) - (NativeModules.ExtraDimensions['SMART_BAR_HEIGHT'] || 0));

export const Dims = {
  deviceWidth, deviceHeight, softBarHeight: ((NativeModules.ExtraDimensions && NativeModules.ExtraDimensions['SOFT_MENU_BAR_HEIGHT']) || 0)
};
