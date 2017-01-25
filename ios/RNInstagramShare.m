#import "RNInstagramShare.h"

#import <Photos/Photos.h>
#import <Photos/PHAsset.h>
#import <Photos/PHFetchResult.h>


@implementation RNInstagramShare



// Expose this module to the React Native bridge
RCT_EXPORT_MODULE()






RCT_EXPORT_METHOD(share:(NSString *)path type:(NSString *)type){
  
  __block NSString *localId;

  
  if ([type isEqualToString:@"library"]) {
    
    if ([path hasPrefix:@"asset"]) {
      [self openWithID: [path substringWithRange:NSMakeRange(36, 36)]]; // we need to get id from whole URL
      
    } else {
      [self openWithID: path]; // we need to get id from whole URL
      
    }
  } else {
    
    // video
    [[PHPhotoLibrary sharedPhotoLibrary] performChanges:^{
      
      
     PHAssetChangeRequest* createAssetRequest = [PHAssetChangeRequest creationRequestForAssetFromVideoAtFileURL:[NSURL URLWithString:path]];
     localId = [[createAssetRequest placeholderForCreatedAsset] localIdentifier];

    } completionHandler:^(BOOL success, NSError *error) {
      if (success){
        [self openWithID:localId];
      }
    }];

  }
}

- (void)openWithID:(NSString *)localId {
  NSURL *instagramURL       = [NSURL URLWithString:[NSString stringWithFormat:@"instagram://library?LocalIdentifier=%@", localId]];
  
  if ([[UIApplication sharedApplication] canOpenURL:instagramURL]) {
    [[UIApplication sharedApplication] openURL:instagramURL];
  }

}



@end
