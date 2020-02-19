import { FONTS, Image ,ScrollView, Text, TouchableOpacity, View, windowHeight, windowWidth } from 'Hairfolio/src/helpers';
import { observer } from "mobx-react";
import { ListView } from "react-native";
import React, { Component } from "react";
import { StyleSheet} from 'react-native';
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
import ProductComponentRow from '../ProductComponentRow';
import ProductStore from '../../mobx/stores/hfStore/ProductStore';

@observer
export default class Product extends Component{
	constructor(props) {
		super(props);
		this.state ={
		list: []
		}
		
	}
	
	componentDidMount() {

		let store = ProductTagStore;
		this.setState({list: store.dataSourceForFilter._dataBlob.s1});
		if(this.props.categoriesData){
			this.setState({list: this.props.categoriesData});
		}
	}
	
	async onStarClick(data,index) {
		// showAlert("PRODUCT COMPONENT JS ==> "+JSON.stringify(data))
		showLog("IS FROM NEW ARRIVAL ==> "+ProductTagStore.isNewArrival)
		showLog("IS FROM TRENDING ==> "+ProductTagStore.isTrending)
		let wishListStore = WishListStore;
		if(data.is_favourite) {
		  showLog("FROM SEARCH UN FAV ==>"+JSON.stringify(data))
		  await wishListStore.removeProductFromWishList(data.id).then((result) => {
			if(result.status == "201"){
				
				this.reloadProducts(data,false); 
				           				
			} 
			else {
			//   alert('Something went wrong!')
			}
		  });
		} else {
		  showLog("FROM SEARCH FAV ==> "+JSON.stringify(data))
		  await wishListStore.addProductToWishList(data.id).then((result) => {
			if(result.status == "201") {
				this.reloadProducts(data,true); 
			}
			else {
			//   alert('Something went wrong!')
			}
		  });
		}
	  }
	

	async reloadProducts(data,isFav) {
		
		let store = ProductTagStore;
	
		ProductTagStore.products.filter((e,index) => {
       
			if (e.id == data.id) {
			//   alert(JSON.stringify(e.is_favourite+"===>"+index))
			  ProductTagStore.products[index].is_favourite = isFav
			  ProductTagStore.isChanged = "y";
			}
		  });

		
	}

	async reloadSearchProducts(data,index,isFavourite) {
		
		let store = SearchProductStore;
		store.load();
		
	}

	async onClickObject(item, index) {

		let res = await ProductStore.getProdDetail(item.id);

		if (res) {
			if (res.error) {
				showLog("CAT PROD LIST ==> " + res.error)
				showAlert(res.error)
			}
			else {
				this.props.navigator.push({
					screen: 'hairfolio.ProductDetail',
					navigatorStyle: NavigatorStyles.tab,
					passProps: {
						prod_id: item.id,
						isFrom: "productComponent",
						categoryTitle: (!SearchProductStore.isFrom) ?
							this.props.categoryTitle : item.name
					}

				});
			}
		}
	}

	render() {

		return (

			<ListView
				style={{ flex: 1 }}
				contentContainerStyle={styles.listContainer}
				bounces={false}
				enableEmptySections={true}
				dataSource={(ProductTagStore.dataSourceForFilter)}
				renderRow={(item, index) => {
					return (
						<ProductComponentRow 
						
							item={item}
							indx={index}
							isChanged = {ProductTagStore.isChanged}
							onPress={() => {
								this.onClickObject(item, index)
							}}

							
							onStarClick={() => {
								this.onStarClick(item, index)
							}}
							onAddCartClick={() => {
								let prod_id = item.id;
								// CartStore.addToCart(prod_id, item.quantity);
								CartStore.addToCart(prod_id, 1);
							}}
							store = {ProductTagStore}
						/>
					);
				}}
				onEndReached={() => {
					if (SearchProductStore.isFrom) {
						//  pStore.loadNextPage();
						ProductTagStore.loadNextPageNew(SearchProductStore.searchString, true);
					}
					else {
						ProductTagStore.loadNextPageNew(ProductTagStore.lastSearchedText, true);
					}

				}}
				renderFooter={() => {

					if (ProductTagStore.nextPage != null) {

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
				} />

		)
	}

	render2() {

		// let pStore;

		// if(SearchProductStore.isFrom)
		// {
		// 	// pStore = SearchProductStore;
		// 	pStore = ProductTagStore;
		// }
		// else
		// {
		// 	pStore = ProductTagStore;
		// }
		
		return(
			ProductTagStore.isChanged ? 
			<ListView
			   style={{flex:1}}
			   contentContainerStyle={styles.listContainer}
			   bounces={false}
			   enableEmptySections={true}
			   dataSource={(ProductTagStore.dataSourceForFilter)}
			   renderRow={(item,index) => {
					return(
						ProductTagStore.isChanged ?
						<View
							style={styles.listRowContainer}>
							<TouchableOpacity
								style={styles.btnClickView}
								onPress={ ()=> {
									this.props.navigator.push({
										screen: 'hairfolio.ProductDetail',
										navigatorStyle: NavigatorStyles.tab,
										passProps: {
										prod_id: item.id,
										isFrom:"productComponent",
										categoryTitle: (!SearchProductStore.isFrom) ? 
																	this.props.categoryTitle : item.name
										}
										
										});
								}}>
								<Image
									// source={(item.product_image) ? { uri: (BASE_URL + item.product_image)} : require('img/medium_placeholder_icon.png')}
									// source={(item.product_image) ? { uri: item.product_image } : require('img/medium_placeholder_icon.png')}
									source={(item.product_thumb)? { uri: item.product_thumb } : require('img/medium_placeholder_icon.png')}
									onError={()=>{
										item.product_thumb = data.product_image;
									}}  
									style={styles.imageView} />
								<TouchableOpacity
									style={styles.startClick}
									onPress={() => {
										this.onStarClick(item,index)
										}} >
										<Image
										style={styles.starImageView}
										source={(item.is_favourite) ? require('img/star_fill_icon.png') : require('img/star_border_icon.png')}/>
								</TouchableOpacity>
						</TouchableOpacity>



						<Text
							style={styles.itemNameView} 
							numberOfLines={2}>{item.name}</Text>

						<View style={styles.addToCartView}>

							<TouchableOpacity 
							onPress={()=>{
							let prod_id= item.id;
							// CartStore.addToCart(prod_id,item.quantity);
							CartStore.addToCart(prod_id,1);
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
						 :
						 null       
					)
			   }}
			//    onEndReached={() => {
			// 	   if(SearchProductStore.isFrom)
			// 	   {
			// 		//  pStore.loadNextPage();
			// 		ProductTagStore.loadNextPageNew(SearchProductStore.searchString);
			// 	   }
			// 	   else
			// 	   {
			// 		ProductTagStore.loadNextPageNew(ProductTagStore.lastSearchedText);
			// 	   }
					
			//    }}
			   renderFooter={() => {

			   if (ProductTagStore.nextPage != null ) {

			   return (
					   <View
					   style={{flex: 1,
							width:windowWidth,
							paddingVertical: 20,
							alignItems: "center",
							justifyContent: "center",
							left:0,
							right:0,
							bottom:-10,
							position:'absolute'
					   }}
					   >
					   <ActivityIndicator size="large" />
					   </View>
					   );
			   } else {
			   return <View />;
			   }
			   }
			   }/>
			   :
			   null
			)
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
