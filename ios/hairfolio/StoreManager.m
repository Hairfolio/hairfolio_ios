#import "RCTConvert.h"
#import "RCTUtils.h"

#import "StoreManager.h"

// s'occupe l'air de rien d'inclure Parse

@interface StoreManager()


@end

@implementation StoreManager

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

#pragma mark

// general stuff

RCT_EXPORT_METHOD(get:(RCTResponseSenderBlock)callback)
{
  
  
  NSMutableDictionary *initialState = [NSMutableDictionary dictionaryWithDictionary:@{
                                                                                      @"cache.app.version": [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"],
                                                                      @"cache.app.host": @"http://hairfolio.herokuapp.com"
                                                                                      }];
  
  // Let's load user defaults we saved previously with Settings
  NSDictionary *userState = [[NSUserDefaults standardUserDefaults] dictionaryRepresentation];
  
  for(NSString *key in userState) {
    if([key hasPrefix:@"cache."]) {
      [initialState setObject:[userState objectForKey:key] forKey:key];
    }
  }
  
  callback(@[initialState]);
  
}

@end