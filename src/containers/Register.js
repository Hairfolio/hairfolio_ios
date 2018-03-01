import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { COLORS, FONTS, SCALE, h } from '../style';
import { observer } from 'mobx-react';
import SimpleButton from '../components/Buttons/Simple';
import UserStore from '../mobx/stores/UserStore';
import { Dims } from '../constants';
import NavigatorStyles from '../common/NavigatorStyles';
import Intro from '../components/Intro';
import { LOADING } from '../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: Dims.deviceHeight,
    width: Dims.deviceWidth,
  },
  buttonContainer: {
    flex: 1,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: h(42),
    width: h(383),
    marginBottom: 30,
  },
});

@observer
export default class Register extends PureComponent {
  render() {
    if (UserStore.userState === LOADING) {
      return <Intro />;
    }
    return (
      <Image
        resizeMode="cover"
        source={require('../images/onboarding.jpg')}
        style={styles.backgroundContainer}
      >
        <View
          style={styles.container}
        >
          <View style={styles.buttonContainer}>
            <Image
              style={styles.logo}
              source={require('img/onboarding_logo.png')}
            />
            <View style={{paddingBottom: 10, alignSelf: 'stretch'}}>
              <SimpleButton
                color={COLORS.FB}
                icon="facebook"
                label="Use Facebook"
                onPress={() => {
                  UserStore.setMethod('facebook');
                  this.props.navigator.push({
                    screen: 'hairfolio.Register2',
                    animationType: 'fade',
                    navigatorStyle: NavigatorStyles.onboarding,
                  });
                }}
              />
            </View>
            <View style={{paddingBottom: 10, alignSelf: 'stretch'}}>
              <SimpleButton
                color={COLORS.IG}
                icon="instagram"
                label="Use Instagram"
                onPress={() => {
                  UserStore.setMethod('instagram');
                  this.props.navigator.push({
                    screen: 'hairfolio.Register2',
                    animationType: 'fade',
                    navigatorStyle: NavigatorStyles.onboarding,
                  });
                }}
              />
            </View>
            <View style={{paddingBottom: 10, alignSelf: 'stretch'}}>
              <SimpleButton
                color={COLORS.DARK}
                icon="email"
                label="Use your email"
                onPress={() => {
                  UserStore.setMethod('email');
                  this.props.navigator.push({
                    screen: 'hairfolio.Register2',
                    animationType: 'fade',
                    navigatorStyle: NavigatorStyles.onboarding,
                  });
                }}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.props.navigator.resetTo({
                screen: 'hairfolio.Login',
                animationType: 'fade',
                navigatorStyle: NavigatorStyles.onboarding,
              });
            }}
            style={{backgroundColor: 'transparent'}}
          >
            <Text style={{
              fontFamily: FONTS.MEDIUM,
              fontSize: SCALE.h(28),
              color: COLORS.WHITE,
              textAlign: 'center',
              marginBottom: 10,
            }}>Already a Member? <Text style={{fontFamily: FONTS.HEAVY}}>Sign in</Text></Text>
          </TouchableOpacity>
        </View>
      </Image>
    );
  }
};
