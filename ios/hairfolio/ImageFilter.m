//
//  TwiiterLogin.m
//  MotivvateU
//
//  Created by Patrick Klitzke on 4/11/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "ImageFilter.h"
#import <CoreImage/CIFilter.h>
#import <CoreImage/CIImage.h>


#import <Photos/Photos.h>
#import <Photos/PHAsset.h>
#import <Photos/PHFetchResult.h>
#import <Photos/PHImageManager.h>
#import <Photos/PhotosTypes.h>


@implementation ImageFilter

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

// filtername for example : CISepiaTone
RCT_EXPORT_METHOD(filterImage:(NSString *)path filterName:(NSString *)filterName callback:(RCTResponseSenderBlock)callback) {
  
  //  Convert UIColor to CIColor
  
  CGSize size = CGSizeMake(400, 400);

  
  NSURL* imageURL = [NSURL URLWithString:path];
  
  
  PHFetchResult *results;
    results = [PHAsset fetchAssetsWithALAssetURLs:@[imageURL] options:nil];
  
  
  PHAsset *asset = [results firstObject];
  PHImageRequestOptions *imageOptions = [PHImageRequestOptions new];
  
  
  // Note: PhotoKit defaults to a deliveryMode of PHImageRequestOptionsDeliveryModeOpportunistic
  // which means it may call back multiple times - we probably don't want that
  imageOptions.deliveryMode = PHImageRequestOptionsDeliveryModeHighQualityFormat;
  
  CGSize targetSize;
  targetSize = CGSizeApplyAffineTransform(size, CGAffineTransformMakeScale(2.0, 2.0));
  imageOptions.resizeMode = PHImageRequestOptionsResizeModeFast;
  
  
  PHImageContentMode contentMode = PHImageContentModeAspectFill;
 
  [[PHImageManager defaultManager] requestImageForAsset:asset
                                             targetSize:targetSize
                                            contentMode:contentMode
                                                options:imageOptions
                                          resultHandler:^(UIImage *result, NSDictionary<NSString *, id> *info) {
                                            //  Convert UIImage to CIImage
                                            
                                            CIImage *ciImage = [[CIImage alloc] initWithImage:result];
                                            
                                            //  Set values for CIColorMonochrome Filter
                                            CIFilter *filter = [CIFilter filterWithName:filterName
                                                                          keysAndValues:kCIInputImageKey, ciImage, nil];
                                            
                                            // [filter setValue:[NSNumber numberWithDouble:0.75]  forKey: @"inputPower"];

                                            
                                            ciImage = [filter outputImage];
                                            
                                            
                                            
                                            CIContext *context   = [CIContext contextWithOptions:nil];
                                            CGImageRef cgImage   = [context createCGImage:ciImage fromRect:ciImage.extent];
                                            UIImage *filteredImage       = [UIImage imageWithCGImage:cgImage];
                                            
                                            NSData *data = UIImageJPEGRepresentation(filteredImage, 0.8);
                                            NSString *dataString = [data base64EncodedStringWithOptions:0]; // base64 encoded image string
                                            
                                            callback(@[dataString]);
                                            
                                            
                                            
                                            
                                            
  }];

  


  /*
        UIImage *imgResult = [UIImage imageWithData:imageData scale:1];
        
        
        
        //  Convert UIImage to CIImage
        CIImage *ciImage = [[CIImage alloc] initWithImage:imgResult];
        
        //  Set values for CIColorMonochrome Filter
        CIFilter *filter = [CIFilter filterWithName:@"CISepiaTone" keysAndValues:kCIInputImageKey, ciImage, nil];
        
        
        
        UIImage *filteredImage =  [UIImage imageWithCIImage:[filter outputImage]];
        
        NSData *data = UIImagePNGRepresentation(filteredImage);
        
        callback(@[data]);
  
  */
  
  
  
  
  
  
  
  
  
  
}




@end
