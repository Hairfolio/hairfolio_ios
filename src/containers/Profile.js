import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {View, InteractionManager} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import SimpleButton from '../components/Buttons/Simple';

import {BOTTOMBAR_HEIGHT, STATUSBAR_HEIGHT} from '../constants';

import {loginStack, login, search} from '../routes';

@connect(app)
export default class Profile extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  render() {
    return (<NavigationSetting
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
        paddingTop: STATUSBAR_HEIGHT,
        paddingBottom: BOTTOMBAR_HEIGHT
      }}
    >
      <View style={{
        flex: 1,
        padding: 20,
        justifyContent: 'center'
      }}>
        <SimpleButton
          color={COLORS.DARK}
          label="Log Out"
          onPress={() => {
            loginStack.scene().jumpTo(login);
            _.first(this.context.navigators).jumpTo(loginStack);
            InteractionManager.runAfterInteractions(() => _.last(this.context.navigators).jumpTo(search));
          }}
          ref="submit"
        />
      </View>
    </NavigationSetting>);
  }
};
