/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>
#import <React/RCTLog.h>
#import <React/RCTUtils.h>
#import "RCCManager.h"
#import <asl.h>

#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>
#import <Fabric/Fabric.h>
#import <TwitterKit/TwitterKit.h>
#import "PDKClient.h"
#import <Crashlytics/Crashlytics.h>
#import <Firebase.h>
#import "RNFirebaseMessaging.h"
//#import "RNFirebaseNotification.h"
@import UserNotifications;

NSString *const kGCMMessageIDKey = @"375699502310";

@interface AppDelegate () <UNUserNotificationCenterDelegate>
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];

  // facebook sdk
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  
  [Fabric with:@[[Crashlytics class], [Twitter class]]];
  
  // Pinterest configuration
  [PDKClient configureSharedInstanceWithAppId:@"4881270499925049265"];
  
  
  NSURL *jsCodeLocation;
  
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.backgroundColor = [UIColor whiteColor];
  
  [FIRMessaging messaging].delegate = self;
  
  // Register for remote notifications. This shows a permission dialog on first run, to
  // show the dialog at a more appropriate time move this registration accordingly.
  // [START register_for_notifications]
  if ([UNUserNotificationCenter class] != nil) {
    // iOS 10 or later
    // For iOS 10 display notification (sent via APNS)
    [UNUserNotificationCenter currentNotificationCenter].delegate = self;
    UNAuthorizationOptions authOptions = UNAuthorizationOptionAlert |
    UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
    [[UNUserNotificationCenter currentNotificationCenter]
     requestAuthorizationWithOptions:authOptions
     completionHandler:^(BOOL granted, NSError * _Nullable error) {
       // ...
     }];
  } else {
    // iOS 10 notifications aren't available; fall back to iOS 8-9 notifications.
    UIUserNotificationType allNotificationTypes =
    (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge);
    UIUserNotificationSettings *settings =
    [UIUserNotificationSettings settingsForTypes:allNotificationTypes categories:nil];
    [application registerUserNotificationSettings:settings];
  }
  
  [application registerForRemoteNotifications];
  
  [[RCCManager sharedInstance] initBridgeWithBundleURL:jsCodeLocation launchOptions:launchOptions];
  return YES;
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}

// [START receive_message]
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
  // If you are receiving a notification message while your app is in the background,
  // this callback will not be fired till the user taps on the notification launching the application.
  // TODO: Handle data of notification
  
  // With swizzling disabled you must let Messaging know about the message, for Analytics
  // [[FIRMessaging messaging] appDidReceiveMessage:userInfo];
  
  // Print message ID.
  if (userInfo[kGCMMessageIDKey]) {
    NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
  }
  [[[UIAlertView alloc] initWithTitle:@"dada " message:@"asd " delegate:self cancelButtonTitle:@"Okay" otherButtonTitles:@"cancel", nil] show];
  
  
  
  // Print full message.
  NSLog(@"%@", userInfo);
}


//- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
//fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
//  // If you are receiving a notification message while your app is in the background,
//  // this callback will not be fired till the user taps on the notification launching the application.
//  // TODO: Handle data of notification
//
//  // With swizzling disabled you must let Messaging know about the message, for Analytics
//  // [[FIRMessaging messaging] appDidReceiveMessage:userInfo];
//
//  // Print message ID.
//  if (userInfo[kGCMMessageIDKey]) {
//    NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
//  }
//  [[[UIAlertView alloc] initWithTitle:@"dada " message:@"asd " delegate:self cancelButtonTitle:@"Okay" otherButtonTitles:@"cancel", nil] show];
//
//
//  // Print full message.
//  NSLog(@"%@", userInfo);
//
//  completionHandler(UIBackgroundFetchResultNewData);
//}
// [END receive_message]


// [START ios_10_message_handling]
// Receive displayed notifications for iOS 10 devices.
// Handle incoming notification messages while app is in the foreground.
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
  NSDictionary *userInfo = notification.request.content.userInfo;
  
  // With swizzling disabled you must let Messaging know about the message, for Analytics
  // [[FIRMessaging messaging] appDidReceiveMessage:userInfo];
  
  // Print message ID.
  if (userInfo[kGCMMessageIDKey]) {
    NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
  }
  
  // Print full message.
  NSLog(@"%@", userInfo);
  
  // Change this to your preferred presentation option
  completionHandler(UNNotificationPresentationOptionNone);
  //  completionHandler(UNNotificationPresentationOptionAlert);
  
}

// Handle notification messages after display notification is tapped by the user.
//- (void)userNotificationCenter:(UNUserNotificationCenter *)center
//didReceiveNotificationResponse:(UNNotificationResponse *)response
//         withCompletionHandler:(void(^)(void))completionHandler {
//  NSDictionary *userInfo = response.notification.request.content.userInfo;
//  if (userInfo[kGCMMessageIDKey]) {
//    NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
//  }
//
//  // Print full message.
//  NSLog(@"%@", userInfo);
//
//  completionHandler();
//}

// [END ios_10_message_handling]

// [START refresh_token]
- (void)messaging:(FIRMessaging *)messaging didReceiveRegistrationToken:(NSString *)fcmToken {
  NSLog(@"FCM registration token: %@", fcmToken);
  
  // TODO: If necessary send token to application server.
  // Note: This callback is fired at each app startup and whenever a new token is generated.
}
// [END refresh_token]

// [START ios_10_data_message]
// Receive data messages on iOS 10+ directly from FCM (bypassing APNs) when the app is in the foreground.
// To enable direct data messages, you can set [Messaging messaging].shouldEstablishDirectChannel to YES.
- (void)messaging:(FIRMessaging *)messaging didReceiveMessage:(FIRMessagingRemoteMessage *)remoteMessage {
  NSLog(@"Received data message: %@", remoteMessage.appData);
  
  
  [[[UIAlertView alloc] initWithTitle:@"dada " message:@"didReceiveMessage " delegate:self cancelButtonTitle:@"Okay" otherButtonTitles:@"cancel", nil] show];
}

// [END ios_10_data_message]

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  NSLog(@"Unable to register for remote notifications: %@", error);
}

// This function is added here only for debugging purposes, and can be removed if swizzling is enabled.
// If swizzling is disabled then this function must be implemented so that the APNs device token can be paired to
// the FCM registration token.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  NSString *token = [[deviceToken description] stringByTrimmingCharactersInSet: [NSCharacterSet characterSetWithCharactersInString:@"<>"]];
  token = [token stringByReplacingOccurrencesOfString:@" " withString:@""];
  NSLog(@"content---%@", token);
  NSLog(@"APNs device token retrieved: %@", token);
  
  // With swizzling disabled you must set the APNs device token here.
  // [FIRMessaging messaging].APNSToken = deviceToken;
}


//- (BOOL)application:(UIApplication *)application
//            openURL:(NSURL *)url
//            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
//
//  if ([url.absoluteString hasPrefix:@"fb"]) {
//    return [[FBSDKApplicationDelegate sharedInstance] application:application
//                                                          openURL:url
//                                                sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
//                                                       annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
//            ];
//
//  }
//
//  if ([url.absoluteString hasPrefix:@"pdk"] || [url.absoluteString hasPrefix:@"pinterest"]) {
//    return [[PDKClient sharedInstance] handleCallbackURL:url];
//  }
//
//
//  return [RCTLinkingManager application:application
//                                openURL:url
//                      sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
//                             annotation:options[UIApplicationOpenURLOptionsAnnotationKey]];
//
//}


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

//- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
//fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
//  [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
//}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
  [[RNFirebaseMessaging instance] didRegisterUserNotificationSettings:notificationSettings];
}

-(void) userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler {
  
  [[RNFirebaseMessaging instance] didReceiveRemoteNotification:response.notification.request.content.userInfo];
  completionHandler();
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




- (BOOL)application:(UIApplication* )application continueUserActivity:(NSUserActivity* )userActivity restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler{
  
  return [RCTLinkingManager application:application
                   continueUserActivity:userActivity
                     restorationHandler:restorationHandler];
  
  
}


@end

