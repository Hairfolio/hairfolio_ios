//
//  QRCodeGenerator.m
//  Hairfolio
//
//  Created by agilemac-32 on 27/05/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
//#import <React/RCTBridge.h>
//#import <React/RCTEventDispatcher.h>


@interface RCT_EXTERN_MODULE(QRGenerator, NSObject)

//RCT_EXTERN_METHOD(testFunction);

//RCT_EXTERN_METHOD(addEvent:(NSString *)name location:(NSString *)location date:(nonnull NSNumber *)date callback: (RCTResponseSenderBlock)callback);
RCT_EXTERN_METHOD(getDATA);

//RCT_EXTERN_METHOD(generateQRCode:(NSString *)qrCodeUrl);

RCT_EXTERN_METHOD(generateQRCode2:(NSString *)qrCodeUrl arr:(NSArray *)arr)

RCT_EXTERN_METHOD(generateQRCode:(NSString *)qrCodeUrl)

RCT_EXTERN_METHOD(addEvent:(NSString *)name callback: (RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(shareToInstagram:(NSString *)url)


@end

