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
  
  
  if ([path hasPrefix:@"file"]) {
    
    NSString* newPath = [path substringFromIndex:6];
    
    UIImage* image = [UIImage imageWithContentsOfFile:newPath];
    
    
    
    CIImage *ciImage = [[CIImage alloc] initWithImage:image];
    
    //  Set values for CIColorMonochrome Filter
    CIFilter *filter = [CIFilter filterWithName:filterName
                                  keysAndValues:kCIInputImageKey, ciImage, nil];
    
    
    ciImage = [filter outputImage];
    
    
    
    CIContext *context   = [CIContext contextWithOptions:nil];
    CGImageRef cgImage   = [context createCGImage:ciImage fromRect:ciImage.extent];
    UIImage *filteredImage       = [UIImage imageWithCGImage:cgImage];
    
    NSData *data = UIImageJPEGRepresentation(filteredImage, 0.8);
    NSString *dataString = [data base64EncodedStringWithOptions:0]; // base64 encoded image string
    
    callback(@[dataString]);
  } else {
    
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
    
  }
}

RCT_EXPORT_METHOD(newFilterImage:(NSString *)path
                  filterName:(NSString *)filterName
                  params:(NSDictionary *)params
                  callback:(RCTResponseSenderBlock)callback) {
  
  //  Convert UIColor to CIColor
  
  
//  if ([path hasPrefix:@"Users"]) {
  
    NSString* newPath = path; //[path substringFromIndex:6];
  
    UIImage* image = [UIImage imageWithContentsOfFile:newPath];
  
  if(image != nil){
    CIImage *ciImage = [[CIImage alloc] initWithImage:image];
    
    [self createFilter:filterName params:params ciImage:ciImage callback:callback];
    
    //  } else {
    //
    //
    //    CGSize size = CGSizeMake(400, 400);
    //    NSURL* imageURL = [NSURL URLWithString:path];
    //
    //    NSLog(@"************ FILE ==> %@", imageURL);
    //
    //    PHFetchResult *results;
    //    results = [PHAsset fetchAssetsWithALAssetURLs:@[imageURL] options:nil];
    //
    //    NSLog(@"$$$$$$$$$ FILE ==> %@", results);
    //    if(results.count > 0)
    //    {
    //      PHAsset *asset = [results firstObject];
    //      PHImageRequestOptions *imageOptions = [PHImageRequestOptions new];
    //
    //    // Note: PhotoKit defaults to a deliveryMode of PHImageRequestOptionsDeliveryModeOpportunistic
    //    // which means it may call back multiple times - we probably don't want that
    //    imageOptions.deliveryMode = PHImageRequestOptionsDeliveryModeHighQualityFormat;
    //
    //    CGSize targetSize;
    //    targetSize = CGSizeApplyAffineTransform(size, CGAffineTransformMakeScale(2.0, 2.0));
    //    imageOptions.resizeMode = PHImageRequestOptionsResizeModeFast;
    //
    //
    //    PHImageContentMode contentMode = PHImageContentModeAspectFill;
    //
    //    [[PHImageManager defaultManager] requestImageForAsset:asset
    //                                               targetSize:targetSize
    //                                              contentMode:contentMode
    //                                                  options:imageOptions
    //                                            resultHandler:^(UIImage *result, NSDictionary<NSString *, id> *info) {
    //                                              //  Convert UIImage to CIImage
    //
    //                                              CIImage *ciImage = [[CIImage alloc] initWithImage:result];
    //
    //                                              [self createFilter:filterName params:params ciImage:ciImage callback:callback];
    //
    //                                            }];
    //    }
    //  }
    
  }
    
  
}



- (void)createFilter:(NSString *)filterName params:(NSDictionary *)params ciImage:(CIImage *)ciImage  callback:(RCTResponseSenderBlock)callback {
  
  CIFilter *filter = [CIFilter filterWithName:filterName
                                keysAndValues:kCIInputImageKey, ciImage, nil];
  
  // [filter setValue:[NSNumber numberWithDouble:0.75]  forKey: @"inputPower"];
  
  for(id key in params) {
    
    if ([key isEqualToString:@"inputColor"]) {
      NSDictionary * colorDict = params[key];
      NSNumber *red = colorDict[@"red"];
      NSNumber *green = colorDict[@"green"];
      NSNumber *blue = colorDict[@"blue"];
      NSNumber *alpha = colorDict[@"alpha"];
      
      CIColor *color = [CIColor
                        colorWithRed:[red floatValue]
                        green:[green floatValue]
                        blue:[blue floatValue]
                        alpha:[alpha floatValue]];
      
      [filter setValue:color forKey:key];

    } else {
      // [filter setValue:[NSNumber numberWithDouble:0.75]  forKey: @"inputPower"];
      [filter setValue:params[key] forKey:key];
    }
  }
  
  
  ciImage = [filter outputImage];
  
  
  
  CIContext *context   = [CIContext contextWithOptions:nil];
  CGImageRef cgImage   = [context createCGImage:ciImage fromRect:ciImage.extent];
  UIImage *filteredImage       = [UIImage imageWithCGImage:cgImage];
  
  NSData *data = UIImageJPEGRepresentation(filteredImage, 0.8);
  NSString *dataString = [data base64EncodedStringWithOptions:0]; // base64 encoded image string
 
   NSLog(@"************ datastring_ ==> %@", dataString);

  callback(@[dataString]);
}




@end
