import {
  COLORS,
  FONTS,
  SCALE
} from '../style';

export default {
  onboarding: {
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: COLORS.WHITE,
  },
  basicInfo: {
    navBarTransparent: false,
    navBarTranslucent: false,
    drawUnderNavBar: false,
    navBarBackgroundColor: COLORS.DARK,
    navBarTextColor: COLORS.WHITE,
    navBarButtonColor: COLORS.WHITE,
    navBarTextFontFamily: FONTS.ROMAN,
    navBarTextFontSize: SCALE.h(34),
    screenBackgroundColor: COLORS.LIGHT,
  },
  tab: {
    navBarHidden: true,
    statusBarTextColorScheme: 'dark',
    statusBarTextColorSchemeSingleScreen: 'dark',
  }
};