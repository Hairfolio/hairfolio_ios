# hairfolio_ios

`npm install`

`npm install -g fontello-cli`

`gulp setup-fontello`

`gulp setup-fonts`

to edit/add icons

`fontello-cli open --config fontello.json`

make the modifications, then download json config file and paste content in fontello.json then run

`gulp setup-fontello`


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

## Native Components

The native facebook sdk and a few other bits an bobs are side-loaded into the react-native environment.

Native third party components are managed using [Carthage](https://github.com/Carthage/Carthage)

Though there are other options the simplest way to install carthage is via homebrew

```
brew update
brew install carthage
```

Once carthage has been installed you need checkout and build the dependent frameworks

```
cd ios/carthage
carthage bootstrap --platform iOS
```

That's it. The side-loaded components are ready to go.
