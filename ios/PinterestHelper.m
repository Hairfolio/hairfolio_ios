#import "PinterestHelper.h"

#import "PDKClient.h"


@implementation PinterestHelper

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()


RCT_REMAP_METHOD(login, resolver: (RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  
  
  
  [[PDKClient sharedInstance] authenticateWithPermissions:@[PDKClientReadPublicPermissions, PDKClientWritePublicPermissions] fromViewController:nil withSuccess:^(PDKResponseObject *responseObject) {
    
    
    
    resolve(@[[NSNull null]]);
    
  } andFailure:^(NSError *error) {
    reject(0, @"Some error occured", error);
  }];
}


RCT_REMAP_METHOD(getBoards, resolver2: (RCTPromiseResolveBlock)resolve
                 rejecter2:(RCTPromiseRejectBlock)reject)
{
  
  NSMutableSet *fields = [NSMutableSet set];
  
  [fields addObject:@"id"];
  [fields addObject:@"name"];

  
  [[PDKClient sharedInstance] getAuthenticatedUserBoardsWithFields:fields success:^(PDKResponseObject *responseObject) {
    resolve(@[[NSNull null]]);
  } andFailure:^(NSError *error) {
    reject(0, @"Some error occured", error);
  }];
}




@end
