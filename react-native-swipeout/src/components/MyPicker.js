import { observer } from 'mobx-react';
import React from 'react';
import { Dimensions, Picker, Text, View } from 'react-native';
import { COLORS } from '../helpers';

const MyPicker = observer(({onValueChange, title, value, data, isShown, onConfirm, onCancel}) => {

  if (!isShown) {
    return <View />;
  }

  return (
    <View>
      <View style={{backgroundColor: COLORS.LIGHT7, flexDirection: 'row', height: 30, alignItems: 'center', width: Dimensions.get('window').width, flex: 1, paddingHorizontal: 10}}>
        <Text onPress={onCancel} style={{flex: 1, color: COLORS.LIGHT_BLUE}} >Cancel </Text>
        <Text style={{flex: 1, textAlign: 'center'}}>{title}</Text>
        <Text onPress={onConfirm} style={{flex: 1, textAlign: 'right', color: COLORS.LIGHT_BLUE}} >Confirm</Text>
      </View>
      <Picker
        selectedValue={value}
        style={{backgroundColor: COLORS.WHITE}}
        onValueChange={onValueChange}>

        {data.map(data =>
            <Picker.Item key={data} label={data} value={data} />
        )}
      </Picker>
    </View>
  );
});

export default MyPicker;
