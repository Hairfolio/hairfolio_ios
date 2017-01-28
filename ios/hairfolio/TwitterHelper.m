#import "TwitterHelper.h"
#import <TwitterKit/Twitter.h>
#import <TwitterCore/TWTRSessionStore.h>

@implementation TwitterHelper

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()


RCT_REMAP_METHOD(login, resolver: (RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[Twitter sharedInstance] logInWithCompletion:^(TWTRSession *session, NSError *error) {
    if (session) {
      NSLog(@"signed in as %@", @[session.userName, session.userID, session.authToken, session.authTokenSecret]);
      /*
      callback(@[@"success", session.userName, session.userID, session.authToken, session.authTokenSecret, [NSNull null]]);
       */
      resolve(@[@"success", session.userName, session.userID, session.authToken, session.authTokenSecret, [NSNull null]]);
    } else {
      NSLog(@"error: %@", [error localizedDescription]);
      reject(0, error.localizedDescription, error);
    }
  }];
}


- (void)tweetHelp:(NSString *)tweetContent mediaId:(NSNumber *)mediaId callback:(RCTResponseSenderBlock)callback errorCallback:(RCTResponseSenderBlock)errorCallback {
  
  NSString *userID = [Twitter sharedInstance].sessionStore.session.userID;
  TWTRAPIClient *client = [[TWTRAPIClient alloc] initWithUserID:userID];
  
  
  NSString *statusesShowEndpoint = @"https://api.twitter.com/1.1/statuses/update.json";
  NSDictionary *params = @{
                           @"status": tweetContent,
                           @"media_ids": [mediaId stringValue]
                           };
  NSError *clientError;
  
  NSURLRequest *request = [client URLRequestWithMethod:@"POST" URL:statusesShowEndpoint parameters:params error:&clientError];
  
  if (request) {
    [client sendTwitterRequest:request completion:^(NSURLResponse *response, NSData *data, NSError *connectionError) {
      if (data) {
        
        callback(@[[NSNull null]]);
      }
      else {
        errorCallback(@[[NSNull null]]);
      }
    }];
  }
  else {
    errorCallback(@[[NSNull null]]);
  }
}



RCT_EXPORT_METHOD(tweet:(NSString *)tweetContent imageUrl:(NSString *)imageUrl callback:(RCTResponseSenderBlock)callback errorCallback:(RCTResponseSenderBlock)errorCallback) {
  
  
  NSData * imageData = [[NSData alloc] initWithContentsOfURL: [NSURL URLWithString: imageUrl]];
  
  NSString *imageString = [imageData base64EncodedStringWithOptions:0];
  
  
  NSString *userID = [Twitter sharedInstance].sessionStore.session.userID;
  TWTRAPIClient *client = [[TWTRAPIClient alloc] initWithUserID:userID];
  
  
  NSString *endPoint = @"https://upload.twitter.com/1.1/media/upload.json";
  NSDictionary *params = @{@"media": imageString};
  
  NSURLRequest *request = [client URLRequestWithMethod:@"POST" URL:endPoint parameters:params error:nil];
  
  if (request) {
    [client sendTwitterRequest:request completion:^(NSURLResponse *response, NSData *data, NSError *connectionError) {
      if (data) {
        // handle the response data e.g.
        NSError *jsonError;
        NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:0 error:&jsonError];
        
        
        [self tweetHelp:tweetContent mediaId:json[@"media_id"] callback:callback errorCallback:errorCallback];
        
      } else {
        errorCallback(@[[NSNull null]]);
      }
    }];
  }
  else {
    errorCallback(@[[NSNull null]]);
  }
}


/*
NSString *media = @"https://upload.twitter.com/1.1/media/upload.json";

NSData *imageData = UIImageJPEGRepresentation(image, 0.9);

NSString *imageString = [imageData base64EncodedStringWithOptions:0];
NSError *error;
NSURLRequest *request = [[[Twitter sharedInstance] APIClient] URLRequestWithMethod:@"POST" URL:media parameters:@{@"media":imageString} error:&error];

[[[Twitter sharedInstance] APIClient] sendTwitterRequest:request completion:^(NSURLResponse *urlResponse, NSData *data, NSError *connectionError) {
  
  NSError *jsonError;
  NSDictionary *json = [NSJSONSerialization
                        JSONObjectWithData:data
                        options:0
                        error:&jsonError];
  NSLog(@"Media ID :  %@",[json objectForKey:@"media_id_string"]);
  
  // Post tweet With media_id
}];
 */


/*
RCT_EXPORT_METHOD(searchContacts:(NSString *)cursor callback:(RCTResponseSenderBlock)callback errorCallback:(RCTResponseSenderBlock)errorCallback) {
  
  NSString *userID = [Twitter sharedInstance].sessionStore.session.userID;
  TWTRAPIClient *client = [[TWTRAPIClient alloc] initWithUserID:userID];
  
  NSString *statusesShowEndpoint = @"https://api.twitter.com/1.1/friends/list.json";
  NSDictionary *params = @{@"cursor": cursor, @"count" : @"200"};
  NSError *clientError;
  
  NSURLRequest *request = [client URLRequestWithMethod:@"GET" URL:statusesShowEndpoint parameters:params error:&clientError];
  
  if (request) {
    [client sendTwitterRequest:request completion:^(NSURLResponse *response, NSData *data, NSError *connectionError) {
      if (data) {
        // handle the response data e.g.
        NSError *jsonError;
        NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:0 error:&jsonError];
        
        NSArray *users = [json objectForKey:@"users"];
        
        NSMutableArray *arr = [[NSMutableArray alloc] init];
        
        for (NSDictionary *dict in  users) {
          NSLog(@"id: %@  name:%@",  [dict objectForKey:@"id"], [dict objectForKey:@"name"]);
          [arr addObject:[dict objectForKey:@"id"]];
        }
        
        NSString* nextCursor = [[json objectForKey:@"next_cursor"] stringValue];
        
        
        callback(@[nextCursor, arr, [NSNull null]]);
      }
      else {
        errorCallback(@[[NSNull null]]);
      }
    }];
  }
  else {
    errorCallback(@[[NSNull null]]);
  }
}
*/


@end
