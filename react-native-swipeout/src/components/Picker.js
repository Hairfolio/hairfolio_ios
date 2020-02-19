'use strict';
import _ from 'lodash';
import React, {PropTypes} from 'React';
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  PickerIOS,
  Image
} from 'react-native';
import {COLORS, FONTS, SCALE} from './../style';
import PureComponent from './PureComponent';
import CustomTouchableOpacity from './CustomTouchableOpacity';
import Icon from './Icon';

import {
  windowWidth
} from 'Hairfolio/src/helpers';
import { showLog } from '../helpers';

export default class Picker extends PureComponent {
  static propTypes = {
    choices: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    onDone: PropTypes.func,
    placeholder: PropTypes.string
  };

  state = {
    active: false
  };

  dismiss = () => {
    this.setState({active: false});
  }

  render() {
    return (<View style={{alignSelf: 'stretch'}}>
      <CustomTouchableOpacity
        disabled={this.props.disabled}
        onPress={() => {
          this.setState({
            active: true,
            selected: _.isFinite(this.state.selected) ? this.state.selected : 0
          });
        }}
      >
        <View style={{
          backgroundColor: (this.props.isSearch) ? COLORS.TRANSPARENT : COLORS.WHITE,
          height: (this.props.isSearch) ? SCALE.h(58) : SCALE.h(17 * 2 + 48), // height: SCALE.h(17 * 2 + 48),
          flexDirection: 'row',
          borderRadius: 1
        }}>
          {(this.props.isSearch) ? null :
            <View style={{
            flex: 1,
            alignItems: 'center',
            paddingLeft: SCALE.w(24),
            flexDirection: 'row'
          }}>
            <Text style={{
              fontFamily: FONTS.ROMAN,
              fontSize: SCALE.h(34),
              color: COLORS.DARK
            }}>{_.get(this.props.choices, [this.state.selected, 'label'], this.props.placeholder)}</Text>
          </View>}
          <View style={{
            width: SCALE.w(102),
            justifyContent: 'center',
            alignItems: 'center',
            borderLeftWidth: (this.props.isSearch) ? 0 : 1,
            borderLeftColor: COLORS.DARK,

            backgroundColor: (this.props.isSearch) ? COLORS.WHITE1 : COLORS.WHITE,
            height: (this.props.isSearch) ? SCALE.h(58) : SCALE.h(17 * 2 + 48),
            borderRadius:(this.props.isSearch) ? SCALE.h(7) : 0,
          }}>
          {(this.props.isSearch) ?
            <Image
              style={{
                width: SCALE.h(32),
                height: SCALE.h(32),
                alignSelf: "flex-end",
                marginRight: 15,
                resizeMode: 'stretch',
                tintColor: COLORS.BLACK
                // padding:12,
              }}
              source={require("img/filter_icon.png")}
            />
          :
            <Icon
              color={COLORS.DARK}
              name="down"
              size={SCALE.h(19)}
            />}
          </View>
        </View>
      </CustomTouchableOpacity>
      <Modal
        animationType={"slide"}
        transparent
        visible={this.state.active}
      >
        <View style={{flex: 1}}>
          <TouchableOpacity
            onPress={() => {
              this.setState({active: false})
              showLog('Modal has been closed.'+ this.props.onDone)
              if (this.props.onDone) {
                setTimeout(
                  () => {
                    this.props.onDone(this.props.choices[this.state.selected]);
                  },
                  1000
                );
              }
            }}
            style={{flex: 1}}
          />
          <View style={{
            height: SCALE.h(86),
            backgroundColor: COLORS.WHITE,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.LIGHT2,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({active: false});
                if (this.props.onDone) {
                  setTimeout(
                    () => {
                      this.props.onDone(this.props.choices[this.state.selected]);
                    },
                    1000
                  );
                }
              }}
            >
              <Text style={{
                fontFamily: FONTS.ROMAN,
                fontSize: SCALE.h(34),
                color: COLORS.DARK,
                marginRight: SCALE.w(40)
              }}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{
            height: SCALE.h(353),
            backgroundColor: COLORS.WHITE,
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <PickerIOS
              itemStyle={{
                fontFamily: FONTS.MEDIUM,
                color: COLORS.DARK
              }}
              onValueChange={(selected) => this.setState({selected})}
              selectedValue={this.state.selected}
              style={{
                width: windowWidth
              }}
            >
              {_.map(this.props.choices, ({label, value}, i) =>
                <PickerIOS.Item
                  key={i}
                  label={label}
                  value={i}
                />
              )}
            </PickerIOS>
          </View>
        </View>
      </Modal>
    </View>);
  }
}
