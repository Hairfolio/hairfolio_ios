import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, View, windowWidth, showLog, windowHeight } from '../helpers';
import { COLORS, FONTS, SCALE } from '../style';
import ProductTagStore from '../mobx/stores/ProductTagStore';
import { observer } from 'mobx-react/native';

// export default class ProductComponentRow extends React.Component {


//   constructor(props){
//     super(props)

//     showLog("PRODUCT COMPONENET ROW ==> "+JSON.stringify(this.props.item))

//   }

//   render() {
//       let item = this.props.item;
//     return (
//         <View
//         style={styles.listRowContainer}>
//         <TouchableOpacity
//             style={styles.btnClickView}
//             onPress={this.props.onPress}>
//             <Image
//                 // source={(item.product_image) ? { uri: (BASE_URL + item.product_image)} : require('img/medium_placeholder_icon.png')}
//                 source={(item.product_image) ? { uri: item.product_image } : require('img/medium_placeholder_icon.png')}
//                 style={styles.imageView} />
//             <TouchableOpacity
//                 style={styles.startClick}
//                 onPress={this.props.onStarClick}>
                
//                     <Image
//                     style={styles.starImageView}
//                     source={(item.is_favourite) ? require('img/star_fill_icon.png') : require('img/star_border_icon.png')}/>
//             </TouchableOpacity>
//     </TouchableOpacity>



//     <Text
//         style={styles.itemNameView} 
//         numberOfLines={2}>{item.name}</Text>

//     <View style={styles.addToCartView}>

//         <TouchableOpacity 
//         onPress={this.props.onAddCartClick}
//         style={styles.addToCartClick}>
//             <Text 
//             style={styles.AddTextView}>Add</Text>
//         </TouchableOpacity>

//         {(item.discount_percentage) ?
//         <View>
//             <View style={{ flexDirection: 'row' }}>
//                 <Text
//                 style={styles.priceLabel}>{(item.price) ? ("$" + item.price) : "$0.0"}</Text>

//                 <Text
//                 style={styles.finalPriceLabel}>{(item.final_price) ? ("$" + item.final_price) : "$0.0"}</Text>
//             </View>
//                 <Text
//                 style={styles.finalPriceLabel}>{item.discount_percentage}% off</Text>
//         </View>
//         :
//         <Text
//         style={styles.finalPriceLabel}>{(item.final_price) ? ("$" + item.final_price) : "$0.0"}</Text>
//         }
//     </View> 
// </View> 
//     );
//   }
// }

const ProductComponentRow = observer(({item, index,onPress,onStarClick,onAddCartClick,store}) => {
	let placeholder_icon = require('img/medium_placeholder_icon.png');
    // const windowEdge = Math.round(windowWidth / 2);
    return (
        <View
        style={styles.listRowContainer}>
        <TouchableOpacity
            style={styles.btnClickView}
            onPress={onPress}>
            <Image
                // source={(item.product_image) ? { uri: (BASE_URL + item.product_image)} : require('img/medium_placeholder_icon.png')}
                defaultSource={placeholder_icon}
				source={(item.product_image) ? { uri: item.product_image } : placeholder_icon}
                style={styles.imageView} />
            <TouchableOpacity
                style={styles.startClick}
                onPress={onStarClick}>
                    {(ProductTagStore.isChanged.length>0) ?
                
                    <Image
                    style={styles.starImageView}
                    source={(item.is_favourite) ? require('img/star_fill_icon.png') : require('img/star_border_icon.png')}/>
                    // source={(ProductTagStore.products[index].is_favourite) ? require('img/star_fill_icon.png') : require('img/star_border_icon.png')}/>
                    :
                    <Image
                    style={styles.starImageView}
                    source={(item.is_favourite) ? require('img/star_fill_icon.png') : require('img/star_border_icon.png')}/>
                    }
            </TouchableOpacity>
    </TouchableOpacity>



    <Text
        style={styles.itemNameView} 
        numberOfLines={2}>{item.name}</Text>

    <View style={styles.addToCartView}>

        <TouchableOpacity 
        onPress={onAddCartClick}
        style={styles.addToCartClick}>
            <Text 
            style={styles.AddTextView}>Add</Text>
        </TouchableOpacity>

        {(item.discount_percentage) ?
        <View>
            <View style={{ flexDirection: 'row' }}>
                <Text
                style={styles.priceLabel}>{(item.price) ? ("$" + item.price) : "$0.0"}</Text>

                <Text
                style={styles.finalPriceLabel}>{(item.final_price) ? ("$" + item.final_price) : "$0.0"}</Text>
            </View>
                <Text
                style={styles.finalPriceLabel}>{item.discount_percentage}% off</Text>
        </View>
        :
        <Text
        style={[styles.finalPriceLabel, {color: COLORS.BLACK}]}>{(item.final_price) ? ("$" + item.final_price) : "$0.0"}</Text>
        }
    </View> 
</View> 
    );
  });
  
  export default ProductComponentRow;



const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		padding: 10,
		backgroundColor: COLORS.WHITE,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between'
	},
	productImageView: {
		flex: 1,
		width: (windowWidth / 2) - 30,
		height: (windowHeight / 2) - 150,
		resizeMode: 'contain',
	},
	imageClickView: {
		position: 'absolute',
		top: 7,
		right: 7,
	},
	priceLabel: {
		color: COLORS.GRAY2,
		fontFamily: FONTS.ROMAN,
		fontSize: SCALE.h(27),
		textDecorationLine: 'line-through'
	},
	finalPriceLabel: {
		color: COLORS.DISCOUNT_RED,
		fontFamily: FONTS.ROMAN,
		fontSize: SCALE.h(27),
		marginLeft: 10
	},
	listContainer:{ 
		padding: 10, 
		backgroundColor: COLORS.WHITE, 
		flexDirection: 'row', 
		flexWrap: 'wrap', 
		justifyContent: 'space-between' 
	},
	listRowContainer:{
		margin: 5,
		marginTop: 10,
		width: (windowWidth / 2) - 20,
		height: (windowHeight / 2) - 80,
	},
	btnClickView:{
		borderRadius: 5,
		width: (windowWidth / 2) - 20,
		height: (windowHeight / 2) - 150,
		alignItems: 'center',
		elevation: 1,
		shadowOpacity: 0.10,
		// shadowRadius: 0.8,
		shadowOffset: {
			height: 1.2,
			width: 1.2
		}
	},
	imageView:{
		flex: 1,
		width: (windowWidth / 2) - 30,
		height: (windowHeight / 2) - 150,
		resizeMode: 'contain',

	},
	startClick:{
		position: 'absolute',
		top: 7,
		right: 7,
	},
	starImageView:{
		position: 'absolute',
		top: 7,
		right: 7,
	},
	itemNameView:{
		marginTop: 7,
		color: COLORS.BLACK,
		fontFamily: FONTS.LIGHT,
		textAlign: 'center',
		justifyContent: 'center',
		fontSize: SCALE.h(25),
	},
	addToCartView:{
		marginTop: 5,
		marginBottom: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	addToCartClick:{
		backgroundColor: COLORS.DARK,
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 3,
		paddingBottom: 3,
		marginLeft: 5
	},
	AddTextView:{
		color: COLORS.WHITE,
		fontFamily: FONTS.MEDIUM,
		fontSize: SCALE.h(25)
	}

});
