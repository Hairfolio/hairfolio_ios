import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {Text, View, ScrollView, TouchableOpacity} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, FONTS} from '../style';
import BottomButton from '../components/Buttons/Bottom';
import Icon from '../components/Icon';
import NavigationSetting from '../navigation/NavigationSetting';

import {hello} from '../routes';

import {NAVBAR_HEIGHT} from '../constants';

@connect(app)
export default class ForgottenPassword extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  state = {
    pushSelected: false
  };

  render() {
    return (<NavigationSetting
      leftAction={() => {
        _.first(this.context.navigators).jumpTo(hello);
      }}
      leftIcon="back_arrow"
      onWillBlur={this.onWillBlur}
      onWillFocus={this.onWillFocus}
      style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
        paddingTop: NAVBAR_HEIGHT
      }}
      title="terms & conditions"
    >
      <View style={{
        flex: 1
      }}>
        <ScrollView
          contentContainerStyle={{
            paddingTop: 22,
            paddingBottom: 22,
            paddingLeft: 24,
            paddingRight: 24
          }}
          style={{
            flex: 1
          }}
        >
          <Text style={{
            color: COLORS.DARK,
            fontSize: 11,
            fontFamily: FONTS.REGULAR
          }}>{`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eget sapien sed risus suscipit cursus. Quisque iaculis facilisis lacinia. Mauris euismod pellentesque tellus sit amet mollis. Nulla a scelerisque turpis, in gravida enim. Pellentesque sagittis faucibus elit, nec lobortis augue fringilla sed. Donec aliquam, mi in varius interdum, ante metus facilisis urna, in faucibus erat ex nec lectus. Cras tempus tincidunt purus, eu vehicula ante. Duis cursus vestibulum lorem.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id porttitor magna, id vulputate ligula. Morbi mauris sapien, tincidunt failisis tellus non, fermentum feugiat augue. Nunc feugiat sem vestibulum ullamcorper.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eget sapien sed risus suscipit cursus. Quisque iaculis facilisis lacinia. Mauris euismod pellentesque tellus sit amet mollis. Nulla a scelerisque turpis, in gravida enim. Pellentesque sagittis faucibus elit, nec lobortis augue fringilla sed. Donec aliquam, mi in varius interdum, ante metus facilisis urna, in faucibus erat ex nec lectus. Cras tempus tincidunt purus, eu vehicula ante. Duis cursus vestibulum lorem.`}</Text>
        </ScrollView>
        <View style={{
          height: 1,
          backgroundColor: COLORS.SEMIDARK2
        }} />
        <View style={{
          paddingTop: 12,
          paddingBottom: 38,
          paddingLeft: 24,
          paddingRight: 24
        }}>
          <TouchableOpacity
            onPress={() => {
              requestAnimationFrame(() =>
                this.setState({
                  pushSelected: !this.state.pushSelected
                })
              );
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                height: 18,
                position: 'relative',
                width: 18,
                borderRadius: 3,
                backgroundColor: this.state.pushSelected ? COLORS.PRIMARY.RED : COLORS.SEMIDARK2,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <View style={{
                position: 'absolute',
                top: 4,
                left: 4,
                right: 4,
                bottom: 4,
                backgroundColor: this.state.pushSelected ? COLORS.PRIMARY.RED : COLORS.PRIMARY.WHITE
              }} />
              {this.state.pushSelected && <Icon
                color={COLORS.PRIMARY.WHITE}
                name="chat_flag"
                size={14}
              />}
            </View>
            <Text style={{
              flex: 1,
              color: COLORS.DARK,
              marginLeft: 9,
              fontSize: 13,
              fontFamily: FONTS.REGULAR,
              paddingBottom: 2.5
            }}>Allow push notifications</Text>
          </TouchableOpacity>
        </View>
        <BottomButton
          label="accept and continue"
          onPress={() => {
          }}
        />
      </View>
    </NavigationSetting>);
  }
};
