import { FONTS, Image, ScrollView, Text, TouchableOpacity, View, windowHeight, windowWidth } from 'Hairfolio/src/helpers';
import { observer } from "mobx-react";
import { ListView } from "react-native";
import React, { Component } from "react";
import { StyleSheet } from 'react-native';
import NavigatorStyles from '../../common/NavigatorStyles';
import { BASE_URL } from '../../constants';
import { COLORS, showAlert, ActivityIndicator, showLog } from '../../helpers';
import AllProductStore from '../../mobx/stores/hfStore/AllProductStore';
import ProductTagStore from '../../mobx/stores/ProductTagStore';
import CartStore from '../../mobx/stores/hfStore/CartStore';
import CategoryStore from '../../mobx/stores/hfStore/CategoryStore';
import WishListStore from '../../mobx/stores/hfStore/WishListStore';
import SearchProductStore from '../../mobx/stores/hfStore/SearchProductsStore';
import { SCALE } from '../../style';

@observer
export default class Product extends Component {
	constructor(props) {
		super(props);
		this.state = {
			list: []
		}

	}

	componentDidMount() {

		let store;

		if (this.props.isFrom == SearchProductStore.isFrom) {
			store = SearchProductStore;
		}
		else {
			store = ProductTagStore;
		}
		this.setState({ list: store.dataSourceForFilter._dataBlob.s1 });
		if (this.props.categoriesData) {
			this.setState({ list: this.props.categoriesData });
		}
	}

	async onStarClick(data) {
		// showAlert("PRODUCT COMPONENT JS ==> "+JSON.stringify(data))
		let wishListStore = WishListStore;
		if (data.is_favourite) {
			await wishListStore.removeProductFromWishList(data.id).then((result) => {
				if (result.status == "201") {
					this.reloadProducts();
				}
				else {
					alert('Something went wrong!')
				}
			});
		} else {
			await wishListStore.addProductToWishList(data.id).then((result) => {
				if (result.status == "201") {
					this.reloadProducts();
				}
				else {
					alert('Something went wrong!')
				}
			});
		}
		// CategoryStore.load();
	}



	async reloadProducts() {

		let store = ProductTagStore;
		store.loadMenu();

		store.load("", true, "", "");
		// store.getProductsList("", true,"","");

	}



	render2() {

		let pStore;

		if (this.props.isFrom != SearchProductStore.isFrom) {
			pStore = ProductTagStore;
		}
		else {
			pStore = SearchProductStore;
		}

		return (
			<ListView
				style={{ flex: 1 }}
				contentContainerStyle={style.listContainer}
				bounces={false}
				enableEmptySections={true}
				dataSource={pStore.dataSourceForFilter}
				renderRow={(item, index) => {
					return (
						<View
							style={styles.listRowContainer}>
							<TouchableOpacity
								style={styles.btnClickView}
								onPress={() => {
									this.props.navigator.push({
										screen: 'hairfolio.ProductDetail',
										navigatorStyle: NavigatorStyles.tab,
										passProps: {
											prod_id: item.id,
											categoryTitle: this.props.categoryTitle
										}
									});
								}}>
								<Image
									// source={(item.product_image) ? { uri: (BASE_URL + item.product_image)} : require('img/medium_placeholder_icon.png')}
									source={(item.product_image) ? { uri: item.product_image } : require('img/medium_placeholder_icon.png')}
									style={styles.imageView} />
								<TouchableOpacity
									style={styles.startClick}
									onPress={() => { this.onStarClick(item, index) }} >
									<Image
										style={styles.starImageView}
										source={(item.is_favourite) ? require('img/star_fill_icon.png') : require('img/star_border_icon.png')} />
								</TouchableOpacity>
							</TouchableOpacity>



							<Text
								style={styles.itemNameView} numberOfLines={2}>{item.name}</Text>

							<View style={styles.addToCartView}>

								<TouchableOpacity
									onPress={() => {
										let prod_id = item.id;
										CartStore.addToCart(prod_id, item.quantity);
									}}
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
										style={styles.finalPriceLabel}>{(item.final_price) ? ("$" + item.final_price) : "$0.0"}</Text>
								}
							</View>
						</View>
					)
				}}
				onEndReached={() => {
					pStore.loadNextPageNew(pStore.lastSearchedText);
				}}
				renderFooter={() => {
					// showLog('inside footer pStore.nextPage = ' + pStore.nextPage + ' pStore.isLoadingNextPage = ' + pStore.isLoadingNextPage)

					if (pStore.nextPage != null) {

						return (
							<View
								style={{
									flex: 1,
									width: windowWidth,
									paddingVertical: 20,
									alignItems: "center",
									justifyContent: "center",
									left: 0,
									right: 0,
									bottom: -10,
									position: 'absolute'
								}}
							>
								<ActivityIndicator size="large" />
							</View>
						);
					} else {
						return <View />;
					}
				}
				} />)
	}


}

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
		color: COLORS.BLACK,
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
