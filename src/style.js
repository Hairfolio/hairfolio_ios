// design where 750x1334@2x but rn use
// the 320xY@1x coordinates
export const SCALE = {
  w: (size) => size / 2 * (320 / 375),
  h: (size) => size / 2
};

export const h = (size) => size / 2;

export const COLORS = {
  DARK: '#393939',
  DARK2: '#494949',
  LIGHT2: '#D6D6D6',
  LIGHT3: '#B6B6B6',
  LIGHT4: '#D8D8D8',
  LIGHT: '#F4F4F4',
  WHITE: 'white',

  BACKGROUND_SEARCH_FIELD: '#E6E6E6',
  PLACEHOLDER_SEARCH_FIELD: '#8E8E93',
  SEARCH_LIST_ITEM_COLOR: '#404040',

  BOTTOMBAR_BORDER: '#979797',
  BOTTOMBAR_SELECTED : '#3C3C3C',
  BOTTOMBAR_NOTSELECTED: '#C5C5C5',

  TEXT: '#A7A7A7',

  RED: '#FF3333',
  RED_DELETE: '#DA5454',

  FB: '#3B5998',
  IG: '#F3328C',

  CONSUMER: '#404040',
  STYLIST: '#56E6A5',
  BRAND: '#8ADDDE',
  SALON: '#D284FF',

  GREEN: '#56E6A5',
  BLUE: '#8ADDDE',

  FOLLOWING: '#26C77E',

  COLLAPSABLE_COLOR: '#F3F3F3',
  COLLAPSABLE_TEXT_COLOR: '#BFBFBF',

  ABOUT_SEPARATOR: '#CCCCCC',

  ADDRESS: '#333333'
};

export const FONTS = {
  MEDIUM: 'Avenir-Medium',
  BOOK: 'Avenir-Book',
  ROMAN: 'Avenir-Roman',
  BLACK: 'Avenir-Black',
  HEAVY: 'Avenir-Heavy',
  OBLIQUE: 'Avenir-Oblique',
  SEMIBOLD: 'Avenir-Semibold',
  BOOK_OBLIQUE: 'Avenir-BookOblique',
  MEDIUM_OBLIQUE: 'Avenir-MediumOblique',
  HEAVY_OBLIQUE: 'Avenir-HeavyOblique',
  LIGHT_OBLIQUE: 'Avenir-LightOblique',
  LIGHT: 'Avenir-Light',
  SF_BOLD: 'SFUIDisplay-Bold',
  SF_REGULAR: 'SFUIDisplay-Regular',
};
