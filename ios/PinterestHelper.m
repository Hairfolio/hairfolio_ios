#import "PinterestHelper.h"

#import "PDKClient.h"

#import "PDKResponseObject.h"
#import "PDKBoard.h"

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
    
    NSArray * boards = [responseObject boards];
    
    NSMutableArray* arr = [[NSMutableArray alloc] init];

    
    
    for (PDKBoard *board in boards) {
      [arr addObject:[board name]];
    }
    
    NSMutableDictionary* dict = [[NSMutableDictionary alloc] init];

    [dict setObject:arr forKey:@"boards"];
    
    resolve(dict);
  } andFailure:^(NSError *error) {
    reject(0, @"Some error occured", error);
  }];
}



RCT_REMAP_METHOD(createNewBoard, boardName:(NSString *)boardName resolver2: (RCTPromiseResolveBlock)resolve
                 rejecter2:(RCTPromiseRejectBlock)reject)
{
  [[PDKClient sharedInstance] createBoard:boardName boardDescription:nil withSuccess:^(PDKResponseObject *responseObject) {
    
    resolve(@[[NSNull null]]);
    
  } andFailure:^(NSError *error) {
    reject(0, error.localizedDescription, error);
  }];
}


RCT_REMAP_METHOD(getBoardIdFromName, boardName:(NSString *)boardName resolver: (RCTPromiseResolveBlock)resolve
                 rejecter2:(RCTPromiseRejectBlock)reject)
{
  NSMutableSet *fields = [NSMutableSet set];
  
  [fields addObject:@"id"];
  [fields addObject:@"name"];
  
  
  [[PDKClient sharedInstance] getAuthenticatedUserBoardsWithFields:fields success:^(PDKResponseObject *responseObject) {

    NSArray * boards = [responseObject boards];

    for (PDKBoard *board in boards) {
      if ([[board name] isEqualToString:boardName]) {
        NSMutableDictionary* dict = [[NSMutableDictionary alloc] init];
        [dict setObject:board.identifier forKey:@"id"];
        resolve(dict);
        return;
      }
    }
    
    reject(0, @"Board could not be found", nil);

    
  } andFailure:^(NSError *error) {
    reject(0, error.localizedDescription, error);
  }];
}

RCT_REMAP_METHOD(pinPost, boardId:(NSString *)boardId imageUrl:(NSString *)imageUrl description:(NSString *)description url:(NSString *)url resolver: (RCTPromiseResolveBlock)resolve
                 rejecter2:(RCTPromiseRejectBlock)reject)
{
  [[PDKClient sharedInstance] createPinWithImageURL:[NSURL URLWithString:imageUrl] link:[NSURL URLWithString:url] onBoard:boardId description:description withSuccess:^(PDKResponseObject *responseObject) {
    resolve(@[[NSNull null]]);
  } andFailure:^(NSError *error) {
    reject(0, error.localizedDescription, error);
  }];
}






@end
