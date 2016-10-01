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


RCT_EXPORT_METHOD(getAlbumNames:(RCTResponseSenderBlock)callback) {
  
  NSMutableArray *arr = [[NSMutableArray alloc] init];

  
  PHFetchResult *userAlbums = [PHAssetCollection fetchAssetCollectionsWithType:PHAssetCollectionTypeAlbum subtype:PHAssetCollectionSubtypeAny options:nil];
  PHFetchResult *smartAlbums = [PHAssetCollection fetchAssetCollectionsWithType:PHAssetCollectionTypeSmartAlbum subtype:PHAssetCollectionSubtypeAny options:nil];
  

  
  [userAlbums enumerateObjectsUsingBlock:^(PHAssetCollection *collection, NSUInteger idx, BOOL *stop) {
    // NSLog(@"%@", collection);
    [arr addObject:collection.localizedTitle];
    
    
    PHFetchResult *assetsInCollection = [PHAsset fetchAssetsInAssetCollection:collection options:nil];
    
    
    for (PHAsset *asset in assetsInCollection)
    {
      NSArray *resources = [PHAssetResource assetResourcesForAsset:asset];
      NSString *orgFilename = ((PHAssetResource*)resources[0]).originalFilename;
      NSLog(@"%@", orgFilename);

      // [self.recentsDataSource addObject:asset];
    }

    
    
  }];
  
  [smartAlbums enumerateObjectsUsingBlock:^(PHAssetCollection *collection, NSUInteger idx, BOOL *stop) {
  //  NSLog(@"%@", collection);
    [arr addObject:collection.localizedTitle];

    PHFetchResult *assetsInCollection = [PHAsset fetchAssetsInAssetCollection:collection options:nil];
    
    
    for (PHAsset *asset in assetsInCollection)
    {
      NSLog(@"%@", asset);
      // [self.recentsDataSource addObject:asset];
    }

    
  }];
  
  
  NSLog(@"%@", arr);

    // callback(@[nextCursor, arr, [NSNull null]]);
    // errorCallback(@[[NSNull null]]);
}



@end
