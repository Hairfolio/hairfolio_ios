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

RCT_EXPORT_METHOD(getVidePath:(NSString *)identifier callback:(RCTResponseSenderBlock)callback) {
  
  NSMutableArray *arr = [[NSMutableArray alloc] init];
  PHFetchResult *results = [PHAssetCollection fetchAssetCollectionsWithLocalIdentifiers:@[identifier]   options:nil];
  
  
  
  for (PHAsset *asset in results) {
    
    if (asset.mediaType == PHAssetMediaTypeVideo) {
      NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
      
      NSArray *resources = [PHAssetResource assetResourcesForAsset:asset];
      NSString *orgFilename = ((PHAssetResource*)resources[0]).originalFilename;
      
      [dict setObject:orgFilename forKey:@"fileName"];

      

      
      [[PHImageManager defaultManager] requestAVAssetForVideo:asset options:nil resultHandler:^(AVAsset *asset, AVAudioMix *audioMix, NSDictionary *info)
       {
         if ([asset isKindOfClass:[AVURLAsset class]])
         {
           NSURL *url = [(AVURLAsset*)asset URL];
           [dict setObject:url.relativePath forKey:@"uri"];
           
           [arr addObject:dict];
           
           
           
           callback(@[arr]);
           return;
         }
       }];
    }
  }
  
  



}


RCT_EXPORT_METHOD(getVideoPath2:(NSString *)identifier callback:(RCTResponseSenderBlock)callback) {
  
  
  NSMutableArray *arr = [[NSMutableArray alloc] init];
  PHFetchResult *results = [PHAssetCollection fetchAssetCollectionsWithLocalIdentifiers:@[identifier]   options:nil];
  
  
  
  for (PHAsset *asset in results) {
    
    if (asset.mediaType == PHAssetMediaTypeVideo) {
      NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
      
      NSArray *resources = [PHAssetResource assetResourcesForAsset:asset];
      NSString *orgFilename = ((PHAssetResource*)resources[0]).originalFilename;
      
      [dict setObject:orgFilename forKey:@"fileName"];
      
      
      
      
      [[PHImageManager defaultManager] requestAVAssetForVideo:asset options:nil resultHandler:^(AVAsset *asset, AVAudioMix *audioMix, NSDictionary *info)
       {
         if ([asset isKindOfClass:[AVURLAsset class]])
         {
         
           NSURL *temp = [[NSFileManager defaultManager] temporaryDirectory];
           
           NSString* newPath = [NSString stringWithFormat:@"%@/%@.mov", temp.path, [NSUUID UUID].UUIDString];
           
           NSURL *fileURL = [NSURL fileURLWithPath:newPath];
                             
           __block NSData *assetData = nil;
           
           // asset is you AVAsset object
           AVAssetExportSession *exportSession = [[AVAssetExportSession alloc] initWithAsset:asset presetName:AVAssetExportPresetMediumQuality];
           
           exportSession.outputURL = fileURL;
           // e.g .mov type
           exportSession.outputFileType = AVFileTypeQuickTimeMovie;
           

           [exportSession exportAsynchronouslyWithCompletionHandler:^(void)
            {
              dispatch_async(dispatch_get_main_queue(), ^{
                NSLog(@"Export Complete %ld %@", (long)exportSession.status, exportSession.error);
                
                assetData = [NSData dataWithContentsOfURL:fileURL];
                NSLog(@"AVAsset saved to NSData.");
                
                
                [dict setObject:newPath forKey:@"uri"];
                
                [arr addObject:dict];
                callback(@[arr]);
                
              });
              
            }];
           
           return;
         }
       }];
    }
  }

  
  
  
  
  
  
  
  
  
  

  
}


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
            
            [dict setObject:asset.localIdentifier forKey:@"id"];
            
            
            long seconds = lroundf(asset.duration); // Since modulo operator (%) below needs int or long
            long min = (seconds % 3600) / 60;
            long sec = seconds % 60;
            
            
            if (asset.mediaType == PHAssetMediaTypeVideo) {
              [dict setObject:@"true" forKey:@"isVideo"];
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
