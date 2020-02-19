//  Created by react-native-create-bridge

#import "testInternet.h"
#import "Reachability.h"

// import RCTBridge
#if __has_include(<React/RCTBridge.h>)
#import <React/RCTBridge.h>
#elif __has_include(“RCTBridge.h”)
#import “RCTBridge.h”
#else
#import “React/RCTBridge.h” // Required when used as a Pod in a Swift project
#endif

// import RCTEventDispatcher
#if __has_include(<React/RCTEventDispatcher.h>)
#import <React/RCTEventDispatcher.h>
#elif __has_include(“RCTEventDispatcher.h”)
#import “RCTEventDispatcher.h”
#else
#import “React/RCTEventDispatcher.h” // Required when used as a Pod in a Swift project
#endif

@implementation testInternet

@synthesize bridge = _bridge;
@synthesize reachab = _reachab;
@synthesize isNetConnected = _isNetConnected;

// Export a native module
// https://facebook.github.io/react-native/docs/native-modules-ios.html
RCT_EXPORT_MODULE();

// Export constants
// https://facebook.github.io/react-native/releases/next/docs/native-modules-ios.html#exporting-constants
- (NSDictionary *)constantsToExport
{
  return @{
           @"EXAMPLE": @"example"
         };
}

// Export methods to a native module
// https://facebook.github.io/react-native/docs/native-modules-ios.html
RCT_EXPORT_METHOD(exampleMethod)
{
  [self emitMessageToRN:@"EXAMPLE_EVENT" :nil];
}


RCT_EXPORT_METHOD(testMethod:(RCTResponseSenderBlock) callback){
  
  [self checkForInternet];
  
  if(self.isNetConnected)
  {
    callback(@[@YES]);
  }
  else
  {
    callback(@[@NO]);
  }
  
  
}


RCT_EXPORT_METHOD(isInternetConnected:(RCTResponseSenderBlock) callback){
  
  [self getNetworkStatus];
  
  if(self.isNetConnected)
  {
    callback(@[@YES]);
  }
  else
  {
    callback(@[@NO]);
  }
  
  
}



RCT_EXPORT_METHOD(stopInternetCheck){
  
  [self stopCheck];
}


- (void) stopCheck{
  
  [self.reachab stopNotifier];
}


- (void)getNetworkStatus
{
  // Allocate a reachability object
//  Reachability* reach = [Reachability reachabilityWithHostname:@"www.google.com"];
//  BOOL isNetConnected;
  self.reachab = [Reachability reachabilityWithHostname:@"www.google.com"];
  
  // Set the blocks
  self.reachab.reachableBlock = ^(Reachability*reach)
  {
    // keep in mind this is called on a background thread
    // and if you are updating the UI it needs to happen
    // on the main thread, like this:
    
    dispatch_async(dispatch_get_main_queue(), ^{
      NSLog(@"REACHABLE!");
      _isNetConnected = true;
      
    });
  };
  
  self.reachab.unreachableBlock = ^(Reachability*reach)
  {
    NSLog(@"UNREACHABLE!");
    _isNetConnected = false;
  };
  
  // Start the notifier, which will cause the reachability object to retain itself!
  [self.reachab startNotifier];
}



- (void)checkForInternet
{
  
  Reachability *myNetwork = [Reachability reachabilityWithHostName:@"google.com"];
  NetworkStatus myStatus = [myNetwork currentReachabilityStatus];
  
  NSLog(@"NETWORK REACHABILITY TYPES ==> %ld",(long)myStatus);
  
  switch (myStatus) {
    case NotReachable:
      NSLog(@"There's no internet connection at all. Display error message now.");
//      self.isNetConnected = NO;
      self.isNetConnected = [myNetwork isReachable];
      break;
    
    case ReachableViaWWAN:
      NSLog(@"We have a 3G connection");
      self.isNetConnected = [myNetwork isReachable];
//      self.isNetConnected = YES;
      break;
    case ReachableViaWiFi:
      NSLog(@"We have wi-fi");
//      self.isNetConnected = YES;
      self.isNetConnected = [myNetwork isReachable];
      break;
      
    default:
      break;
  }

}



// List all your events here
// https://facebook.github.io/react-native/releases/next/docs/native-modules-ios.html#sending-events-to-javascript
- (NSArray<NSString *> *)supportedEvents
{
  return @[@"SampleEvent"];
}

#pragma mark - Private methods

// Implement methods that you want to export to the native module
- (void) emitMessageToRN: (NSString *)eventName :(NSDictionary *)params {
  // The bridge eventDispatcher is used to send events from native to JS env
  // No documentation yet on DeviceEventEmitter: https://github.com/facebook/react-native/issues/2819
  [self sendEventWithName: eventName body: params];
}

@end
