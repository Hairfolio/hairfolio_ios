# hairfolio_ios

### Getting started

#### Install the basics.

```sh
> brew update
> brew install carthage ruby yarn fastlane
> gem install bundle
```

### Prepare to build

Create a `.env` file containing your authorised apple id.

```
APPLE_ID=bob@example.com
```

Bootstrap the dependencies

```sh
> bundle install
> fastlane bootstrap
```

### Build Targets

Once you're bootstrapped the three main commands are:

* `fastlane build` bumps the build number and builds a local .ipa
* `fastlane beta` bumps the build number, builds the ipa and deploys to test flight
* `fastlane release` bumps the build number, builds the ipa and submits for release

# Small adjustements

I did not want to make a fork of RN, so be sure in ./node_modules/react-native-deprecated-custom-components/src/Navigator.js to do that


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
