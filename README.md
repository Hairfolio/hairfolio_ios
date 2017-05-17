# hairfolio_ios

```
git clone git@github.com:gigster-eng/hairfolio_ios.git

cd hairfolio_ios

yarn

react-native start

react-native run-ios
```










# ??Not needed anymore??

I did not want to make a fork of RN, so be sure in node_modules/react-native/Libraries/CustomComponents/Navigator/Navigator.js to do that


`disabledScene: {
  top: -SCREEN_HEIGHT,
  bottom: SCREEN_HEIGHT,
},`


`var SCENE_DISABLED_NATIVE_PROPS = {
  pointerEvents: 'none',
  style: {
    top: -SCREEN_HEIGHT,
    bottom: SCREEN_HEIGHT,
    opacity: 0,
  },
};`

This fix an issue when tabs are too long. Facebook did know that their method could lead to problems:

`// TODO: this is not ideal because there is no guarantee that the navigator
// is full screen, however we don't have a good way to measure the actual
// size of the navigator right now, so this is the next best thing.`

Furthermore, replace  ./node_modules/react-native-camera-kit/ios/lib/ReactNativeCameraKit/CKCamera.m with ./CKCamera.m (same reason as above)

For the property 'persistent' I also modified the core of text.

cp RCTTextField* ./node_modules/react-native/Libraries/Text/

We will also need to install the fbsdk for sharing


Project structure :

cd node_modules && ln -nsf ../app


Refrences:
https://dev.twitter.com/rest/reference/post/statuses/update
