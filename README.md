# hairfolio_ios

`npm install`

`npm install -g fontello-cli`

`gulp setup-fontello`

`gulp setup-fonts`

to edit/add icons

`fontello-cli open --config fontello.json`

make the modifications, then download json config file and paste content in fontello.json then run

`gulp setup-fontello`


I did not want to make a fork of RN, so be sure in react-native/Navigator.js to do that


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

Project structure :

cd node_modules && ln -nsf ../app
