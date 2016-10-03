//
//  TwiiterLogin.m
//  MotivvateU
//
//  Created by Patrick Klitzke on 4/11/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "PhotoAlbum.h"

#import <Photos/Photos.h>
#import <Photos/PHAsset.h>
#import <Photos/PHFetchResult.h>


@implementation PhotoAlbum

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()


RCT_EXPORT_METHOD(getPhotosFromAlbums:(NSString *)name callback:(RCTResponseSenderBlock)callback) {
  
  NSMutableArray *arr = [[NSMutableArray alloc] init];
  
  
  PHFetchResult *userAlbums = [PHAssetCollection fetchAssetCollectionsWithType:PHAssetCollectionTypeAlbum subtype:PHAssetCollectionSubtypeAny options:nil];
  PHFetchResult *smartAlbums = [PHAssetCollection fetchAssetCollectionsWithType:PHAssetCollectionTypeSmartAlbum subtype:PHAssetCollectionSubtypeAny options:nil];
  
  for (PHFetchResult * album in @[userAlbums, smartAlbums]) {
    
    [album enumerateObjectsUsingBlock:^(PHAssetCollection *collection, NSUInteger idx, BOOL *stop) {
      if ([collection.localizedTitle isEqualToString:name]) {
        
        PHFetchResult *assetsInCollection = [PHAsset fetchAssetsInAssetCollection:collection options:nil];
        
        for (PHAsset *asset in assetsInCollection) {
          [arr addObject:asset.localIdentifier];
        }
      }
      
      
      
    }];
  }
  
  callback(@[arr]);
}





RCT_EXPORT_METHOD(getAlbumNames:(RCTResponseSenderBlock)callback) {
  
  NSMutableArray *arr = [[NSMutableArray alloc] init];

  
  PHFetchResult *userAlbums = [PHAssetCollection fetchAssetCollectionsWithType:PHAssetCollectionTypeAlbum subtype:PHAssetCollectionSubtypeAny options:nil];
  PHFetchResult *smartAlbums = [PHAssetCollection fetchAssetCollectionsWithType:PHAssetCollectionTypeSmartAlbum subtype:PHAssetCollectionSubtypeAny options:nil];
  
  for (PHFetchResult * album in @[userAlbums, smartAlbums]) {
    
    [album enumerateObjectsUsingBlock:^(PHAssetCollection *collection, NSUInteger idx, BOOL *stop) {
      //  NSLog(@"%@", collection);
      
      NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
      
      [dict setObject:collection.localizedTitle forKey:@"title"];
      
      
      PHFetchResult *assetsInCollection = [PHAsset fetchAssetsInAssetCollection:collection options:nil];
      
     
      
      [dict setObject:[NSNumber numberWithInt:assetsInCollection.count] forKey:@"count"];
      
      
      for (PHAsset *asset in assetsInCollection)
      {
        NSLog(@"%@", asset);
        [dict setObject:asset.localIdentifier forKey:@"uri"];
        break;
      }
      
     // "assets-library://asset/asset.JPG?id=0DCDB4CA-BB79-477A-983F-8596A7AC55EE&ext=JPG"
      
      if (assetsInCollection.count > 0) {
        [arr addObject:dict];
      }
      
      
      
    }];
  }
  
  callback(@[arr]);
}



@end
