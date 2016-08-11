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

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  [[RCTBundleURLProvider sharedSettings] setDefaults];
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

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

@end
