import buildStyleInterpolator from 'react-native/Libraries/Utilities/buildStyleInterpolator';

var FadeIn = {
  opacity: {
    from: 0,
    to: 1,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: false,
    round: 100
  }
};

var FadeOut = {
  opacity: {
    from: 1,
    to: 0,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: false,
    round: 100
  }
};

var FadeInTAB = {
  opacity: {
    from: 0,
    to: 1,
    min: 0.6,
    max: 1,
    type: 'linear',
    extrapolate: false,
    round: 100
  }
};

var FadeOutTAB = {
  opacity: {
    from: 1,
    to: 0,
    min: 0,
    max: 0.4,
    type: 'linear',
    extrapolate: false,
    round: 100
  }
};

var BaseConfig = {
  // Rebound spring parameters when transitioning FROM this scene
  springFriction: 26,
  springTension: 200,

  // Velocity to start at when transitioning without gesture
  defaultTransitionVelocity: 1.5
};

export default {
  FadeInOut: {
    ...BaseConfig,
    gestures: null,
    animationInterpolators: {
      into: buildStyleInterpolator(FadeIn),
      out: buildStyleInterpolator(FadeOut)
    }
  },
  FadeInOutTAB: {
    ...BaseConfig,
    gestures: null,
    animationInterpolators: {
      into: buildStyleInterpolator(FadeInTAB),
      out: buildStyleInterpolator(FadeOutTAB)
    }
  }
};
