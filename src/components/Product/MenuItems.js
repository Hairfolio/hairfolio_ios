import { h, Image, React, StyleSheet, Text, TouchableOpacity, View } from 'Hairfolio/src/helpers';
import { COLORS, FONTS } from '../../style';
  
const MenuItemsRow = props => {

    return(
        <View style={styles.floatButtonView}>
            <TouchableOpacity style={styles.floatButton}
            onPress={props.onPress}>
            {
                (props.source) 
                ? 
                    <Image
                        style={styles.rightMenuIconNew}
                        source={props.source}
                    />
                : null
            }
            
            <Text style={styles.menuListText}> {props.menuItemText} </Text>
            </TouchableOpacity>
            <View style={(props.isDivider) ? styles.menuItemsDivider : [styles.menuItemsDivider,{height:0}] } />
        </View>
    );
};

export default MenuItemsRow;
  
const styles = StyleSheet.create({
    floatButtonView: {
        marginRight: 0,
        marginTop: 5,
        padding: 5,
        height: h(60),
        width: "100%",
    },
    floatButton: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginLeft: 5,
    },
    rightMenuIconNew: {
        // width: h(38),
        // height: h(38),
    },

    menuListText: {
        color: COLORS.BLACK,
        marginLeft: 8,
        fontFamily: FONTS.SF_REGULAR,
        fontSize: 14,
    },
    menuItemsDivider: {
        height: 1,
        backgroundColor: COLORS.TEXT,
        marginTop: 7,
        marginRight: 0,
        marginLeft: 0
    },
});
  