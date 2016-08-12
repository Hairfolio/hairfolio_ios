// design where 750x1334@2x but rn use
// the 320xY@1x coordinates
export const SCALE = {
  w: (size) => size / 2 * (320 / 375),
  h: (size) => size / 2
};

export const COLORS = {
  DARK: '#393939',
  LIGHT2: '#D6D6D6',
  LIGHT: '#F4F4F4',
  WHITE: 'white',

  BOTTOMBAR_BORDER: '#979797',
  BOTTOMBAR_SELECTED : '#3C3C3C',

  TEXT: '#A7A7A7',

  RED: '#FF3333',

  FB: '#3B5998',
  IG: '#F3328C'
};

export const FONTS = {
  MEDIUM: 'Avenir-Medium',
  ROMAN: 'Avenir-Roman',
  BOLD: 'Avenir-Bold',
  HEAVY: 'Avenir-Heavy',
  SEMIBOLD: 'Avenir-Semibold'
};
