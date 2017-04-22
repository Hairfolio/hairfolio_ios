#import "RNInstagramShare.h"

#import <Photos/Photos.h>
#import <Photos/PHAsset.h>
#import <Photos/PHFetchResult.h>
#import <Photos/PHImageManager.h>






@implementation RNInstagramShare

@synthesize bridge = _bridge;


- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}


// Expose this module to the React Native bridge
RCT_EXPORT_MODULE()




RCT_EXPORT_METHOD(share:(NSString *)path type:(NSString *)type){
  
  __block NSString *localId;

  
  if ([type isEqualToString:@"library"]) {
    
    
    if ([path hasPrefix:@"file"]) {
      NSURL *url = [NSURL URLWithString:path];
      NSData *imageData = [NSData dataWithContentsOfURL:url];
      NSString *writePath = [NSTemporaryDirectory() stringByAppendingPathComponent:@"instagram.igo"];
      
      
      if (![imageData writeToFile:writePath atomically:YES]) {
        // failure
        NSLog(@"image save failed to path %@", writePath);
        return;
      }
      
      
      // send it to instagram.
      NSURL *fileURL = [NSURL fileURLWithPath:writePath];
      
      
      UIViewController *ctrl = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
      
      
      
      self.documentController = [UIDocumentInteractionController interactionControllerWithURL:fileURL];
      
      // documentController.delegate = self;
      [self.documentController setUTI:@"com.instagram.exclusivegram"];
      [self.documentController setAnnotation:@{@"InstagramCaption" : @"We are making fun"}];
      [self.documentController presentOpenInMenuFromRect:ctrl.view.bounds inView:ctrl.view animated:YES];
      
      return;
    } else if ([path hasPrefix:@"asset"]) {
      // we need to get id from whole URL
      localId = [path substringWithRange:NSMakeRange(36, 36)];
    } else {
      localId = path;
    }
    
    NSURL *instagramURL       = [NSURL URLWithString:[NSString stringWithFormat:@"instagram://library?LocalIdentifier=%@", localId]];
    
    if (![[UIApplication sharedApplication] canOpenURL:instagramURL]) {
      UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Instagram not installed"
                                                      message:@"To share on Instagram, please install the Instagram app first."
                                                     delegate:nil
                                            cancelButtonTitle:@"OK"
                                            otherButtonTitles:nil];
      [alert show];
      return;
    }
    
    
    PHFetchResult *results =  [PHAsset fetchAssetsWithLocalIdentifiers:@[localId] options:nil];
    
    for (PHAsset *asset in results) {
      
      
      PHImageRequestOptions *options = [[PHImageRequestOptions alloc]init];
      options.synchronous = YES;
      options.version = PHImageRequestOptionsVersionCurrent;
      
      
      [[PHImageManager defaultManager] requestImageDataForAsset:asset options:options resultHandler:^(NSData * _Nullable imageData, NSString * _Nullable dataUTI, UIImageOrientation orientation, NSDictionary * _Nullable info) {
        
          NSString *writePath = [NSTemporaryDirectory() stringByAppendingPathComponent:@"instagram.igo"];

        
          if (![imageData writeToFile:writePath atomically:YES]) {
            // failure
            NSLog(@"image save failed to path %@", writePath);
            return;
          }
        
      
          // send it to instagram.
          NSURL *fileURL = [NSURL fileURLWithPath:writePath];
        
        
        UIViewController *ctrl = [[[[UIApplication sharedApplication] delegate] window] rootViewController];

        
        
        self.documentController = [UIDocumentInteractionController interactionControllerWithURL:fileURL];
        
          // documentController.delegate = self;
          [self.documentController setUTI:@"com.instagram.exclusivegram"];
          [self.documentController setAnnotation:@{@"InstagramCaption" : @"We are making fun"}];
          [self.documentController presentOpenInMenuFromRect:ctrl.view.bounds inView:ctrl.view animated:YES];
        
        
        
      }];
      
    }
    
    
  } else { // in case of a video open it with normal instagram api
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
