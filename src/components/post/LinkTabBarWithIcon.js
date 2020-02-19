import { COLORS, Animated, FONTS, h, Image, React, StyleSheet, Text, TouchableOpacity, View, showLog } from '../../helpers';

const Button = (props) => {
  return <TouchableOpacity {...props}>
    {props.children}
  </TouchableOpacity>;
};

const LinkTabBarWithIcon = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
    backgroundColor: React.PropTypes.string,
    activeTextColor: React.PropTypes.string,
    inactiveTextColor: React.PropTypes.string,
    textStyle: Text.propTypes.style,
    tabStyle: View.propTypes.style,
    renderTab: React.PropTypes.func,
    underlineStyle: View.propTypes.style,
  },

  getDefaultProps() {
    return {
      backgroundColor: null,
    };
  },

  renderTabOption(name, page) {
  },

  renderTab(name, page, isTabActive, onPressHandler) {
    const { activeTextColor, inactiveTextColor, textStyle, } = this.props;
    const textColor = isTabActive ? COLORS.DARK3 : COLORS.GRAY2;
    const fontFamily = isTabActive ? FONTS.ROMAN : FONTS.LIGHT;

    return <Button
      style={{flex: 1, }}
      key={name}
      accessible={true}
      accessibilityLabel={name}
      accessibilityTraits='button'
      onPress={() => onPressHandler(page)}
    >
      <View style={[styles.tab, this.props.tabStyle, ]}>
        {(isTabActive == 0)
        ?
        (
          (name == "Sort by")
          ?
          <Image source={require('img/sort_by_grey_icon.png')} />
          :
          <Image source={require('img/category_icon.png')} />
        )
        
        :
        (
          (name == "Sort by")
          ?
          <Image source={require('img/sort_by_icon.png')} />
          :
          <Image source={require('img/category_hover_icon.png')} />
        )
        }
        {/* <Image source={icon}></Image> */}
        <Text style={[{color: textColor,marginLeft:5, fontFamily, }, textStyle, ]}>
          {name}
        </Text>
      </View>
    </Button>;
  },

  render() {
    const containerWidth = this.props.containerWidth;
    const numberOfTabs = this.props.tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: h(3),
      backgroundColor: COLORS.RED_TAB_UNDERLINE, //'#3E3E3E',
      bottom: 0,
    };
    showLog("PROPS=>"+JSON.stringify(this.props))
    const left = this.props.scrollValue.interpolate({
      inputRange: [0, 1, ], outputRange: [0, containerWidth / numberOfTabs, ],
    });
    return (
      <View style={[styles.tabs, {backgroundColor: this.props.backgroundColor, }, this.props.style, ]}>
        {this.props.tabs.map((name, page) => {
          const isTabActive = this.props.activeTab === page;
          const renderTab = this.props.renderTab || this.renderTab;
          return renderTab(name, page, isTabActive, this.props.goToPage);
        })}
        <Animated.View style={[tabUnderlineStyle, { left, }, this.props.underlineStyle, ]} />
      </View>
    );
  },
});

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row'
  },
  tabs: {
    height: h(100),
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: COLORS.ABOUT_SEPARATOR,
  },
});

export default LinkTabBarWithIcon;
