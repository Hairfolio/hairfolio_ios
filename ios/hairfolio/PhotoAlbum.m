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
          
          if (asset.mediaType == PHAssetMediaTypeImage || asset.mediaType == PHAssetMediaTypeVideo) {
            NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
            [dict setObject:asset.localIdentifier forKey:@"uri"];
            
            
            long seconds = lroundf(asset.duration); // Since modulo operator (%) below needs int or long
            long min = (seconds % 3600) / 60;
            long sec = seconds % 60;
            
            
            if (asset.mediaType == PHAssetMediaTypeVideo) {
              [dict setObject:@"true" forKey:@"isVideo"];
              /*
               
               if (asset.mediaType == PHAssetMediaTypeVideo) {
               [dict setObject:@"true" forKey:@"isVideo"];
               
               [[PHImageManager defaultManager] requestAVAssetForVideo:asset options:nil resultHandler:^(AVAsset * _Nullable videoAsset, AVAudioMix * _Nullable audioMix, NSDictionary * _Nullable info) {
               NSLog(@"test");
               if (videoAsset is AVURLAsset)
               videoAsset
               }];
               
               */
            } else {
              [dict setObject:@"false" forKey:@"isVideo"];
            }

            
            [dict setObject:[NSString stringWithFormat:@"%ld:%02ld", min, sec] forKey:@"duration"];
            [arr addObject:dict];
          }
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
