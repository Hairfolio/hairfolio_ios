// design where 750x1334@2x but rn use
// the 320xY@1x coordinates
export const SCALE = {
  w: (size) => size * 320 / 375,
  h: (size) => size / 2
};

export const COLORS = {
  DARK: '#393939',
  LIGHT: '#F4F4F4',
  WHITE: 'white',

  SEMIDARK: '#bebebf',
  SEMIDARK2: '#D1D3D4',
  EXTRALIGHT: '#FDFDFD',
  PRIMARY: {
    BLUE: '#00BEDA',
    RED: '#FF4265',
    GREEN: '#7ED321',
    WHITE: 'white'
  },
  SECONDARY: {
    VIOLET: '#854EB7',
    ORANGE: '#F7941E',
    PINK: '#FC88D8',
    RED: '#BE1E2D',
    YELLOW: '#FFD04D',
    GREEN: '#009444',
    BLUE: '#1C75BC'
  }
};

export const FONTS = {
  REGULAR: 'SFUIDisplay-Regular',
  BOLD: 'SFUIDisplay-Bold',
  SEMIBOLD: 'SFUIDisplay-Semibold'
};
