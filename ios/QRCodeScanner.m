//
//  QRCodeScanner.m
//  Hairfolio
//
//  Created by agilemac-32 on 20/05/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "QRCodeScanner.h"
#import "DYQRCodeDecoderViewController.h"
//#import "Hairfolio-Swift.h"

@interface QRCodeScanner()


@end

@implementation QRCodeScanner
  
RCT_EXPORT_MODULE();
  
@synthesize bridge = _bridge;

BOOL flag = NO;
BOOL isAlertON = NO;


//DYQRCodeDecoderViewController *vc;

//RCT_EXPORT_METHOD(filterImage:(NSString *)path filterName:(NSString *)filterName callback:(RCTResponseSenderBlock)callback) {
RCT_EXPORT_METHOD(scanImage:(NSString *)path callback:(RCTResponseSenderBlock)callback) {
  
  
 
  
      DYQRCodeDecoderViewController *vc = [[DYQRCodeDecoderViewController alloc] initWithCompletion:^(BOOL succeeded, NSString *result) {
//  vc = [[DYQRCodeDecoderViewController alloc] initWithCompletion:^(BOOL succeeded, NSString *result) {
        if (succeeded) {
          NSLog(@"QR CODE SCAN SUCCESS ==> %@", result);
          NSString *dataString = result; // base64 encoded image string
          
            if(flag)
            {
              flag = NO;
              callback(@[dataString]);
            }
            else
            {
              [self showAlert];
            }
            

        } else {
             NSLog(@"QR CODE SCAN FAILURE ==> ");
            if(flag)
            {
              flag = NO;
              callback(@[[NSNull null]]);
//              [self showAlert];
            }
            else
            {
              [self showAlert];
            }
          
        }
      }];
      [vc setTitle:@"QR CODE"];
      [vc setNeedsScanAnnimation:YES];
  
//      [[vc leftBarButtonItem] setImage:[UIImage imageNamed:@"your image name"]];
//      [[vc rightBarButtonItem] setImage:[UIImage imageNamed:@"your image name"]];
      //or
      [[vc leftBarButtonItem] setTitle:@"Back"];
      [[vc rightBarButtonItem] setTitle:@"Photos"];
  
    dispatch_async(dispatch_get_main_queue(), ^{
//      UILabel *lblLine = [[UILabel alloc] initWithFrame:CGRectMake(10,
//                                                                   100,
//                                                                   UIScreen.mainScreen.bounds.size.width*95/100,
//                                                                   UIScreen.mainScreen.bounds.size.height*5/100)];

      
      UILabel *lblLine = [[UILabel alloc] initWithFrame:CGRectMake(10,
                                                                   100,
                                                                   UIScreen.mainScreen.bounds.size.width*95/100,
                                                                   UIScreen.mainScreen.bounds.size.height*10/100)];
      
      lblLine.numberOfLines = 2;
      lblLine.textColor = [UIColor colorWithRed:114.0/255.0 green:187.0/255.0 blue:76.0/255.0 alpha:1.0];
      [lblLine setFont:[UIFont systemFontOfSize:25.0]];
      lblLine.text = @"Upload image to see the style and products";
      lblLine.textAlignment = NSTextAlignmentCenter;
      [[vc view] addSubview:lblLine];
      
    });
  
  
      [vc setNavigationBarTintColor:[UIColor blueColor]];
  
  
      UINavigationController *navController = [[UINavigationController alloc] initWithRootViewController:vc];
      dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *ctrl = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
        
        [ctrl presentViewController:navController animated:YES completion: nil];
      });
  
  
  }


RCT_EXPORT_METHOD(updateFlag){
  
  flag = YES;
  
}

RCT_EXPORT_METHOD(enableClick){
  
  flag = YES;
  
}



RCT_EXPORT_METHOD(showAlert){
  

  UIAlertController* alert = [UIAlertController alertControllerWithTitle:@"QR Code Scan Failed"
                                                                 message:@"Something went wrong."
                                                          preferredStyle:UIAlertControllerStyleAlert];
  
  
  
  
  UIAlertAction* defaultAction = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault
                                  
                                                        handler:^(UIAlertAction * action) {}];
 
  
  [alert addAction:defaultAction];
 
  dispatch_async(dispatch_get_main_queue(), ^{
    UIViewController *ctrl = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
//    ctrl.view.frame = CGRectMake(UIScreen.mainScreen.bounds.size.height/2,
//                                  UIScreen.mainScreen.bounds.size.width/2,
//                                  UIScreen.mainScreen.bounds.size.width/2,
//                                  UIScreen.mainScreen.bounds.size.height/2);
    
    isAlertON = YES;
//    [ctrl presentViewController:alert animated:YES completion: nil];
    [ctrl presentViewController:alert animated:YES completion:^{
      isAlertON = NO;
      flag = NO;
      
    }];
  });
  
}

-(NSArray *)detectQRCode:(UIImage *) image
{
  @autoreleasepool {
    NSLog(@"%@ :: %@", NSStringFromClass([self class]), NSStringFromSelector(_cmd));
    NSCAssert(image != nil, @"**Assertion Error** detectQRCode : image is nil");
    
    CIImage* ciImage = image.CIImage; // assuming underlying data is a CIImage
    //CIImage* ciImage = [CIImage initWithCGImage: UIImage.CGImage]; // to use if the underlying data is a CGImage
    
    NSDictionary* options;
    CIContext* context = [CIContext context];
    options = @{ CIDetectorAccuracy : CIDetectorAccuracyHigh }; // Slow but thorough
    //options = @{ CIDetectorAccuracy : CIDetectorAccuracyLow}; // Fast but superficial
    
    CIDetector* qrDetector = [CIDetector detectorOfType:CIDetectorTypeQRCode
                                                context:context
                                                options:options];
    if ([[ciImage properties] valueForKey:(NSString*) kCGImagePropertyOrientation] == nil) {
      options = @{ CIDetectorImageOrientation : @1};
    } else {
      options = @{ CIDetectorImageOrientation : [[ciImage properties] valueForKey:(NSString*) kCGImagePropertyOrientation]};
    }
    
    NSArray * features = [qrDetector featuresInImage:ciImage
                                             options:options];
    
    return features;
    
  }
}
  
 
  

@end
