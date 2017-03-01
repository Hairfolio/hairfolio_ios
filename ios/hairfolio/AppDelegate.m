/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "RCTBundleURLProvider.h"
#import "RCTRootView.h"
#import "RCTUtils.h"
#import "RCTLinkingManager.h"

#import <FBSDKCoreKit/FBSDKCoreKit.h>

#import <Fabric/Fabric.h>
#import <TwitterKit/TwitterKit.h>

#import "PDKClient.h"


#import <Crashlytics/Crashlytics.h>

//Add the following lines
#import <asl.h>
#import "RCTLog.h"


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  // facebook sdk
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  
  [Fabric with:@[[Crashlytics class], [Twitter class]]];
  
  // Pinterest configuration
  [PDKClient configureSharedInstanceWithAppId:@"4881270499925049265"];


  
  //Add the following lines
  RCTSetLogThreshold(RCTLogLevelInfo);
  RCTSetLogFunction(CrashlyticsReactLogFunction);
  
  NSURL *jsCodeLocation;

  [[RCTBundleURLProvider sharedSettings] setDefaults];
  
/*
#if DEBUG
  jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
  jsCodeLocation = [NSURL URLWithString:@"http://192.168.0.255:8081/index.ios.bundle?platform=ios&dev=true"];

#else
 */
  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
//#endif
  

  // jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"hairfolio"
                                               initialProperties:@{
                                                  @"lng": [[[NSBundle mainBundle] preferredLocalizations] objectAtIndex:0],
                                                }
                                                launchOptions:launchOptions];
  
  // Get launch image
  NSString *launchImageName = nil;
  if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPhone) {
    CGFloat height = MAX(RCTScreenSize().width, RCTScreenSize().height);
    if (height == 480) launchImageName = @"Default@2x.png"; // iPhone 4/4s
    else if (height == 568) launchImageName = @"Default-568h@2x.png"; // iPhone 5/5s
    else if (height == 667) launchImageName = @"Default-667h@2x.png"; // iPhone 6
    else if (height == 736) launchImageName = @"Default-736h@3x.png"; // iPhone 6+
  } else if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad) {
    CGFloat scale = RCTScreenScale();
    if (scale == 1) launchImageName = @"LaunchImage-700-Portrait~ipad.png"; // iPad
    else if (scale == 2) launchImageName = @"LaunchImage-700-Portrait@2x~ipad.png"; // Retina iPad
  }
  
  UIImage *image = [UIImage imageNamed:launchImageName];
  
  rootView.backgroundColor = [UIColor colorWithPatternImage:image];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}


- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  if ([url.absoluteString hasPrefix:@"pdk"] || [url.absoluteString hasPrefix:@"pinterest"]) {
      return [[PDKClient sharedInstance] handleCallbackURL:url];
  }
  
  if ([url.absoluteString hasPrefix:@"fb"]) {
    return [[FBSDKApplicationDelegate sharedInstance] application:application
                                                          openURL:url
                                                sourceApplication:sourceApplication
                                                       annotation:annotation];
    
  }
  return [RCTLinkingManager application:application openURL:url
                      sourceApplication:sourceApplication annotation:annotation];
}

RCTLogFunction CrashlyticsReactLogFunction = ^(
                                               RCTLogLevel level,
                                               __unused RCTLogSource source,
                                               NSString *fileName,
                                               NSNumber *lineNumber,
                                               NSString *message
                                               )
{
  NSString *log = RCTFormatLog([NSDate date], level, fileName, lineNumber, message);
  
#ifdef DEBUG
  fprintf(stderr, "%s\n", log.UTF8String);
  fflush(stderr);
#else
  CLS_LOG(@"REACT LOG: %s", log.UTF8String);
#endif
  
  int aslLevel;
  switch(level) {
    case RCTLogLevelTrace:
      aslLevel = ASL_LEVEL_DEBUG;
      break;
    case RCTLogLevelInfo:
      aslLevel = ASL_LEVEL_NOTICE;
      break;
    case RCTLogLevelWarning:
      aslLevel = ASL_LEVEL_WARNING;
      break;
    case RCTLogLevelError:
      aslLevel = ASL_LEVEL_ERR;
      break;
    case RCTLogLevelFatal:
      aslLevel = ASL_LEVEL_CRIT;
      break;
  }
  asl_log(NULL, NULL, aslLevel, "%s", message.UTF8String);
};


@end
