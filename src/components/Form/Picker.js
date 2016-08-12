'use strict';
import _ from 'lodash';
import React, {PropTypes} from 'React';
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  PickerIOS
} from 'react-native';
import {COLORS, FONTS, SCALE} from '../../style';
import PureComponent from '../PureComponent';
import Icon from '../Icon';

export default class Picker extends PureComponent {
  static propTypes = {
    choices: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    onDone: PropTypes.func,
    placeholder: PropTypes.string
  };

  state = {
    active: false
  };

  render() {
    return (<View>
      <TouchableOpacity
        onPress={() => {
          this.setState({
            active: true,
            selected: _.isFinite(this.state.selected) ? this.state.selected : 0
          });
        }}
        style={{
          backgroundColor: COLORS.WHITE,
          height: SCALE.h(17 * 2 + 48),
          flexDirection: 'row',
          borderRadius: 1
        }}
      >
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
        </View>
        <View style={{
          width: SCALE.w(102),
          justifyContent: 'center',
          alignItems: 'center',
          borderLeftWidth: 1,
          borderLeftColor: COLORS.DARK
        }}>
          <Icon
            color={COLORS.DARK}
            name="down"
            size={SCALE.h(19)}
          />
        </View>
      </TouchableOpacity>
      <Modal
        animationType={"slide"}
        transparent
        visible={this.state.active}
      >
        <View style={{flex: 1}}>
          <TouchableOpacity
            onPress={() => this.setState({active: false})}
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
                if (this.props.onDone)
                  this.props.onDone(this.props.choices[this.state.selected]);
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
            height: SCALE.h(323),
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
                width: 320
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
