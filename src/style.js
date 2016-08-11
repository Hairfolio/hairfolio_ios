// design where 750x1334@2x but rn use
// the 320xY@1x coordinates
export const SCALE = {
  w: (size) => size / 2 * (320 / 375),
  h: (size) => size / 2
};

export const COLORS = {
  DARK: '#393939',
  LIGHT: '#F4F4F4',
  WHITE: 'white',

  FB: '#3B5998',
  IG: '#F3328C'
};

export const FONTS = {
  MEDIUM: 'Avenir-Medium',
  BOLD: 'Avenir-Bold',
  HEAVY: 'Avenir-Heavy',
  SEMIBOLD: 'Avenir-Semibold'
};
